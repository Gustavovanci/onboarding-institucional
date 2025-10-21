// src/pages/BenefitsQuizPage.tsx
import { useState, useEffect, useRef } from 'react'; // Import useRef
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useProgressStore } from '../stores/progressStore'; // Import progressStore
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Award } from 'lucide-react';
import FeedbackModal from '../components/ui/FeedbackModal'; // Import FeedbackModal

const quizQuestions = [
    { question: 'Onde está localizado o CeAC e qual é sua principal função?', options: ['Dentro do Instituto Central, responsável apenas por exames admissionais.', 'Ao lado da quadra do Instituto de Psiquiatria (IPq), responsável pelas ações de Medicina do Trabalho e Engenharia de Segurança.', 'No prédio da Administração, responsável por consultas de especialidades médicas.', 'No Centro de Saúde Escola, responsável pelo atendimento de pacientes externos.'], correct: 1, explanation: 'O CeAC reúne as ações do SESMT — Medicina do Trabalho e Engenharia de Segurança — cuidando da saúde ocupacional e bem-estar dos colaboradores do HCFMUSP.' },
    { question: 'Em quais situações o colaborador deve procurar o Serviço de Pronto Atendimento do CeAC?', options: ['Para trocar atestados ou solicitar receitas médicas.', 'Em casos de sintomas agudos que dificultem o trabalho, como dores, febre ou ferimentos leves.', 'Para controle de doenças crônicas como diabetes e hipertensão.', 'Para exames de rotina ou vacinação.'], correct: 1, explanation: 'O Pronto Atendimento do CeAC é voltado a sintomas agudos, que exigem atendimento imediato durante o expediente. Casos crônicos devem ser acompanhados em Unidades Básicas de Saúde.' },
    { question: 'Quais situações NÃO são atendidas pelo Pronto Atendimento do CeAC?', options: ['Ferimentos leves e dores musculares.', 'Dores torácicas e sintomas respiratórios.', 'Solicitação de exames, vacinas ou troca de atestados.', 'Acidentes de trabalho recentes.'], correct: 2, explanation: 'O CeAC não realiza procedimentos administrativos ou de rotina como emissão de laudos, exames, vacinas, troca de receitas ou atestados — o foco é o atendimento emergencial.' },
    { question: 'Como o CeAC organiza a prioridade dos atendimentos de pronto socorro?', options: ['Por ordem de chegada.', 'Conforme a área de trabalho do colaborador.', 'Utilizando o Sistema de Classificação de Risco Manchester.', 'Conforme o horário de agendamento prévio.'], correct: 2, explanation: 'Esse sistema avalia a gravidade dos sintomas, permitindo que casos mais urgentes recebam atendimento prioritário — garantindo rapidez e segurança.' },
    { question: 'Qual é o objetivo do Ambulatório Referenciado da Medicina do Trabalho no CeAC?', options: ['Realizar atendimentos clínicos gerais a todos os colaboradores.', 'Oferecer rastreamento e acompanhamento de doenças em programas de saúde corporativos.', 'Atender pacientes externos do Hospital das Clínicas.', 'Aplicar vacinas e realizar exames periódicos de rotina.'], correct: 1, explanation: 'O ambulatório atua nas linhas de cuidado e programas de saúde — como prevenção de câncer, hipertensão, diabetes e promoção da saúde mental — apenas para colaboradores incluídos nos programas corporativos.' }
];

// Define ID e pontos (lógica complexa baseada em tentativas)
const PAGE_QUIZ_ID = 'beneficios';
// A pontuação será calculada no handleNext

export default function BenefitsQuizPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    // Usa a nova função e o controle do modal
    const { completePageQuiz, isLoading: isProgressLoading, showFeedbackModal, closeFeedbackModal } = useProgressStore();
    const [attempts, setAttempts] = useState(0); // Controle de tentativas

    // Verifica se *este quiz* já foi completado
    const isQuizCompleted = user?.completedPageQuizzes?.includes(PAGE_QUIZ_ID);
    const initialIsCompleted = useRef(isQuizCompleted); // Guarda estado inicial

    const [answers, setAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false); // Feedback da questão

    // Redireciona se já completou no carregamento
    useEffect(() => {
        if (initialIsCompleted.current) {
            navigate('/benefits', { replace: true });
        }
    }, [navigate]);

    const handleAnswer = (optionIndex: number) => {
        if (showFeedback) return;
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setAnswers(newAnswers);
        setShowFeedback(true);
    };

    const handleNext = async () => {
        if (!showFeedback || !user) return;

        setShowFeedback(false); // Esconde feedback da questão atual

        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setQuizFinished(true); // Finaliza o quiz
            const score = answers.reduce((acc, answer, index) => (answer === quizQuestions[index].correct ? acc + 1 : acc), 0);
            const percentage = (score / quizQuestions.length) * 100;
            const passed = percentage >= 70;

            const currentAttempts = attempts + 1; // Calcula tentativas *antes* de potentially chamar completePageQuiz
            setAttempts(currentAttempts); // Atualiza estado local de tentativas

            const alreadyCompleted = useAuthStore.getState().user?.completedPageQuizzes?.includes(PAGE_QUIZ_ID);

            if (passed && !alreadyCompleted) {
                // Lógica de pontos baseada em tentativas
                let pointsToAward = 100; // Pontuação padrão (segunda tentativa ou mais)
                if (currentAttempts === 1) { // Primeira tentativa
                    if (percentage === 100) pointsToAward = 200;
                    else if (percentage >= 75) pointsToAward = 150;
                    // Se < 75% na 1a tentativa, recebe 100
                }
                 console.log(`[BenefitsQuiz] Chamando completePageQuiz para ${PAGE_QUIZ_ID} com ${pointsToAward} pontos.`);
                // Chama a função para registrar a conclusão DESTE quiz
                await completePageQuiz(user.uid, PAGE_QUIZ_ID, pointsToAward);
                 // A verificação geral (checkAndCompleteOnboarding) é chamada DENTRO de completePageQuiz
            } else if (passed && alreadyCompleted){
                 console.log(`[BenefitsQuiz] Quiz já completo, verificando estado geral do onboarding...`);
                 await useProgressStore.getState().checkAndCompleteOnboarding(user.uid);
            }

            // Adiciona delay antes de navegar se passou E modal não está ativo
            if (passed && !useProgressStore.getState().showFeedbackModal) {
                 setTimeout(() => {
                    navigate('/modules');
                 }, 2000); // Aumentado para 2s
             }
        }
    };

    const score = answers.reduce((acc, answer, index) => (answer === quizQuestions[index]?.correct ? acc + 1 : acc), 0);
    const percentage = quizFinished ? (score / quizQuestions.length) * 100 : 0;
    const passed = percentage >= 70; // Usa a mesma condição de aprovação

    // --- Tela de Finalização ---
    if (quizFinished) {
        return (
             <>
                {/* Renderiza o Modal de Feedback GERAL se o estado global for true */}
                <FeedbackModal
                  isOpen={showFeedbackModal}
                  onClose={() => {
                    closeFeedbackModal(); // Fecha o modal via store
                    navigate('/certificates'); // Navega após fechar
                  }}
                />
                {/* Tela de Resultado do Quiz */}
                <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative max-w-2xl mx-auto text-center p-8 bg-white rounded-2xl shadow-xl border">
                        <Award className={`w-20 h-20 mx-auto ${passed ? 'text-brand-green1' : 'text-brand-red'}`} />
                        <h2 className="text-3xl font-bold mt-4">{passed ? 'Parabéns!' : 'Tente novamente!'}</h2>
                        <p className="text-gray-600 mt-2">
                            {passed ? `Você concluiu com ${percentage.toFixed(0)}% de acertos! ${!showFeedbackModal ? 'Redirecionando...' : ''}` : `Você atingiu ${percentage.toFixed(0)}% de acertos, mas o mínimo é 70%. Estude o conteúdo e tente de novo.`}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mt-8">
                            {!passed && <button onClick={() => window.location.reload()} className="btn-secondary w-full">Tentar Novamente</button>}
                             {/* Botão Voltar só aparece se o modal GERAL não estiver ativo */}
                             {!showFeedbackModal && (
                                <button onClick={() => navigate('/modules')} className="btn-primary w-full">Voltar para a Trilha</button>
                             )}
                        </div>
                    </motion.div>
                </div>
            </>
        )
    }

    // --- Tela do Quiz (Questões) ---
     // (Conteúdo da tela de quiz permanece o mesmo)
    const question = quizQuestions[currentQuestionIndex];

    return (
        // Conteúdo JSX da tela de quiz (inalterado)
         <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <div className="relative max-w-2xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div key={currentQuestionIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border">
                <p className="text-sm font-semibold text-brand-azure">Questão {currentQuestionIndex + 1} de {quizQuestions.length}</p>
                <h2 className="text-xl sm:text-2xl font-bold mt-2 text-brand-dark">{question.question}</h2>
                <div className="mt-6 space-y-3">
                  {question.options.map((option, index) => {
                    const hasAnswered = showFeedback;
                    const isSelected = answers[currentQuestionIndex] === index;
                    const isCorrect = question.correct === index;
                    let stateClasses = 'border-gray-300 hover:border-brand-azure hover:bg-blue-50';
                    if (hasAnswered) {
                      if (isCorrect) stateClasses = 'bg-green-100 border-brand-green1 text-brand-green1 font-semibold';
                      else if (isSelected) stateClasses = 'bg-red-100 border-brand-red text-brand-red font-semibold';
                      else stateClasses = 'border-gray-300 opacity-60';
                    }
                     else if (isSelected) {
                         stateClasses = 'bg-blue-100 border-brand-azure';
                     }
                    return (
                      <motion.button key={index} onClick={() => handleAnswer(index)} disabled={hasAnswered} className={`w-full text-left p-4 border-2 rounded-lg transition-all duration-200 flex items-center justify-between disabled:cursor-not-allowed ${stateClasses}`}>
                        <span>{option}</span>
                        {hasAnswered && isCorrect && <CheckCircle className="w-5 h-5" />}
                        {hasAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5" />}
                      </motion.button>
                    );
                  })}
                </div>
                <AnimatePresence>
                  {showFeedback && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4">
                        <div className="p-3 bg-gray-100 rounded-lg text-sm text-gray-700">
                            <strong>Feedback:</strong> {quizQuestions[currentQuestionIndex].explanation}
                        </div>
                        <div className="mt-4 text-right">
                            <button onClick={handleNext} disabled={isProgressLoading} className="btn-primary disabled:opacity-50">
                                {isProgressLoading ? 'Aguarde...' : currentQuestionIndex < quizQuestions.length - 1 ? 'Próxima' : 'Finalizar Quiz'}
                            </button>
                        </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
    );
}