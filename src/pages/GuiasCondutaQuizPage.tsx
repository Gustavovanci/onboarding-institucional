// src/pages/GuiasCondutaQuizPage.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useProgressStore } from '../stores/progressStore'; // Import progressStore
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Award } from 'lucide-react';
import FeedbackModal from '../components/ui/FeedbackModal'; // Import FeedbackModal

const quizQuestions = [
    // Quiz 1 – Cartilha de Compliance 2019
    { question: 'O que significa o termo Compliance?', options: ['Cumprir apenas ordens da chefia', 'Estar em conformidade com leis, normas e princípios éticos', 'Participar de treinamentos obrigatórios', 'Avaliar o desempenho institucional'], correct: 1, explanation: 'Compliance é o compromisso com a integridade, o respeito às leis e a transparência nas ações profissionais.' },
    { question: 'Qual deve ser a atitude correta diante de um conflito de interesse?', options: ['Ocultar a situação para evitar constrangimentos', 'Comunicar formalmente à Diretoria de Compliance', 'Tomar decisões pessoais sem interferência', 'Pedir autorização informal ao gestor'], correct: 1, explanation: 'Conflitos de interesse devem ser declarados para preservar a ética e evitar decisões que privilegiem interesses particulares.' },
    { question: 'É permitido receber brindes ou presentes de empresas acima de R$100?', options: ['Sim, se for de bom gosto', 'Sim, com autorização do setor', 'Não é permitido', 'Apenas em datas comemorativas'], correct: 2, explanation: 'Presentes e brindes de valor elevado configuram conflito de interesse e devem ser recusados.' },
    { question: 'Como deve ser tratada a divulgação de informações institucionais?', options: ['Pode ser feita livremente nas redes sociais', 'É permitida apenas com autorização da Instituição', 'Pode ser feita por qualquer colaborador', 'Desde que o conteúdo seja positivo'], correct: 1, explanation: 'Toda comunicação institucional deve seguir as normas do HCFMUSP e respeitar o sigilo profissional.' },
    { question: 'O que fazer ao identificar uma conduta antiética?', options: ['Ignorar para evitar conflito', 'Comentar com colegas', 'Registrar nos canais oficiais de denúncia', 'Avisar o responsável informalmente'], correct: 2, explanation: 'A denúncia por canais oficiais garante confidencialidade e contribui para a integridade institucional.' },
    // Quiz 2 – Jeito HC de Atender
    { question: 'O que representa o Jeito HC de Atender?', options: ['Um padrão técnico de procedimentos', 'Um modelo de excelência baseado em empatia e respeito', 'Um manual administrativo', 'Uma política de segurança'], correct: 1, explanation: 'O Jeito HC é uma forma de servir com empatia, atenção e profissionalismo, valorizando cada pessoa.' },
    { question: 'Qual é a forma correta de comunicação durante o atendimento?', options: ['Usar expressões informais e gírias', 'Falar com clareza e empatia, mantendo contato visual', 'Interromper o cliente para agilizar', 'Evitar contato direto'], correct: 1, explanation: 'Comunicação clara, tom de voz adequado e escuta ativa são essenciais para um bom atendimento.' },
    { question: 'O que demonstra uma boa apresentação pessoal?', options: ['Uso de acessórios chamativos', 'Uniforme limpo, crachá visível e higiene pessoal', 'Roupas da moda', 'Perfumes fortes e maquiagem intensa'], correct: 1, explanation: 'A aparência profissional transmite respeito, confiança e cuidado com a imagem do HCFMUSP.' },
    { question: 'Como agir diante de um cliente difícil ou nervoso?', options: ['Debater para mostrar autoridade', 'Falar mais alto', 'Manter a calma, ouvir com empatia e buscar solução', 'Encerrar o atendimento rapidamente'], correct: 2, explanation: 'O controle emocional e a empatia ajudam a resolver conflitos e preservam a imagem institucional.' },
    { question: 'O que é essencial para um bom trabalho em equipe?', options: ['Pensar apenas nas tarefas individuais', 'Ter espírito colaborativo e respeito mútuo', 'Evitar dar retorno aos outros setores', 'Focar em apontar erros dos colegas'], correct: 1, explanation: 'O trabalho em equipe é baseado na cooperação, na comunicação clara e no comprometimento coletivo.' }
];

// Define ID e pontos (lógica baseada em tentativas)
const PAGE_QUIZ_ID = 'guias-conduta';
// Pontuação será calculada no handleNext

export default function GuiasCondutaQuizPage() {
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
            navigate('/guias-conduta', { replace: true });
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
            const passed = (score / quizQuestions.length) >= 0.5; // 50% para passar

            const currentAttempts = attempts + 1; // Calcula antes de potencialmente chamar completePageQuiz
            setAttempts(currentAttempts);

            const alreadyCompleted = useAuthStore.getState().user?.completedPageQuizzes?.includes(PAGE_QUIZ_ID);

            if (passed && !alreadyCompleted) {
                // Pontuação: 300 se >= 50% na 1ª tentativa, 100 se >= 50% nas seguintes
                const pointsToAward = (currentAttempts === 1) ? 300 : 100;
                console.log(`[GuiasCondutaQuiz] Chamando completePageQuiz para ${PAGE_QUIZ_ID} com ${pointsToAward} pontos.`);
                // Chama a função para registrar a conclusão DESTE quiz
                await completePageQuiz(user.uid, PAGE_QUIZ_ID, pointsToAward);
                 // A verificação geral (checkAndCompleteOnboarding) é chamada DENTRO de completePageQuiz
            } else if (passed && alreadyCompleted){
                 console.log(`[GuiasCondutaQuiz] Quiz já completo, verificando estado geral do onboarding...`);
                 await useProgressStore.getState().checkAndCompleteOnboarding(user.uid);
            }
            // Não navega automaticamente aqui, deixa o usuário clicar no botão
        }
    };

    const score = answers.reduce((acc, answer, index) => (answer === quizQuestions[index]?.correct ? acc + 1 : acc), 0);
    const percentage = quizFinished ? (score / quizQuestions.length) * 100 : 0;
    const passed = percentage >= 50; // 50% para passar

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
                 <div
                    className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
                    style={{ backgroundImage: "url('/fundo_backdropv2.jpg')" }}
                >
                    <div className="absolute inset-0 bg-brand-green3/80"></div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative max-w-2xl mx-auto text-center p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border">
                        <Award className={`w-20 h-20 mx-auto ${passed ? 'text-brand-green1' : 'text-brand-red'}`} />
                        <h2 className="text-3xl font-bold mt-4">{passed ? 'Parabéns!' : 'Tente novamente!'}</h2>
                        <p className="text-gray-600 mt-2">
                            {passed ? `Você concluiu esta etapa com ${percentage.toFixed(0)}% de acertos!` : `Você atingiu ${percentage.toFixed(0)}% de acertos, mas o mínimo é 50%. Estude o conteúdo e tente novamente.`}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        {!passed ? (
                            <button onClick={() => window.location.reload()} className="btn-secondary w-full">
                                Tentar Novamente
                            </button>
                        ) : null }
                         {/* Botão Continuar/Voltar só aparece se o modal GERAL não estiver ativo */}
                         {!showFeedbackModal && (
                            <button onClick={() => navigate('/modules')} className="btn-primary w-full">
                                {passed ? 'Continuar Trilha' : 'Voltar para Trilha'}
                            </button>
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
        <div
            className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
            style={{ backgroundImage: "url('/fundo_backdropv2.jpg')" }}
        >
            <div className="absolute inset-0 bg-brand-green3/50"></div>
            <div className="relative max-w-2xl mx-auto w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl border"
                    >
                        <p className="text-sm font-semibold text-brand-azure">Questão {currentQuestionIndex + 1} de {quizQuestions.length}</p>
                        <h2 className="text-xl sm:text-2xl font-bold mt-2 text-brand-dark">{question.question}</h2>
                        <div className="mt-6 space-y-3">
                            {question.options.map((option, index) => {
                                const isSelected = answers[currentQuestionIndex] === index;
                                const isCorrect = question.correct === index;
                                let stateClasses = 'border-gray-300 hover:border-brand-azure hover:bg-blue-50';
                                if (showFeedback) {
                                    if (isCorrect) stateClasses = 'bg-green-100 border-brand-green1 text-brand-green1 font-semibold';
                                    else if (isSelected) stateClasses = 'bg-red-100 border-brand-red text-brand-red font-semibold';
                                    else stateClasses = 'border-gray-300 opacity-60';
                                } else if (isSelected) {
                                     stateClasses = 'bg-blue-100 border-brand-azure';
                                }

                                return (
                                <motion.button
                                    key={index}
                                    onClick={() => handleAnswer(index)}
                                    disabled={showFeedback}
                                    className={`w-full text-left p-4 border-2 rounded-lg transition-all duration-200 flex items-center justify-between disabled:cursor-not-allowed ${stateClasses}`}
                                >
                                    <span>{option}</span>
                                    {showFeedback && isCorrect && <CheckCircle className="w-5 h-5 text-brand-green1" />}
                                    {showFeedback && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-brand-red" />}
                                </motion.button>
                                );
                            })}
                        </div>
                        <AnimatePresence>
                        {showFeedback && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mt-4"
                            >
                                <div className="p-3 bg-gray-100 rounded-lg text-sm text-gray-700">
                                    <strong>💡 Feedback:</strong> {question.explanation}
                                </div>
                                <div className="mt-4 text-right">
                                    <button
                                        onClick={handleNext}
                                        disabled={isProgressLoading}
                                        className="btn-primary disabled:opacity-50"
                                    >
                                        {isProgressLoading ? 'Aguarde...' : currentQuestionIndex < quizQuestions.length - 1 ? 'Próxima' : 'Finalizar'}
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