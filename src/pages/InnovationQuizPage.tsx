// src/pages/InnovationQuizPage.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useProgressStore } from '../stores/progressStore'; // Import progressStore
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Award } from 'lucide-react';
import FeedbackModal from '../components/ui/FeedbackModal'; // Import FeedbackModal

const quizQuestions = [
    {
        question: "Qual é o principal propósito do InovaHC, Núcleo de Inovação Tecnológica do Hospital das Clínicas da FMUSP?",
        options: [
            "Realizar atendimentos médicos de alta complexidade.",
            "Transformar conhecimento em inovação aplicada, conectando pessoas e criando soluções para a saúde.",
            "Supervisionar pesquisas clínicas e aprovar protocolos científicos.",
            "Oferecer cursos de capacitação para novos colaboradores."
        ],
        correct: 1,
        explanation: "Desde 2015, o InovaHC atua como agente de transformação, unindo pesquisadores, empreendedores e parceiros para gerar soluções inovadoras que impactam positivamente o sistema de saúde e a qualidade de vida da população."
    }
];

// Define ID e pontos para este quiz específico
const PAGE_QUIZ_ID = 'inovahc';
const QUIZ_POINTS = 100; // Pontos definidos na versão anterior

export default function InnovationQuizPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    // Usa a nova função e o controle do modal
    const { completePageQuiz, isLoading: isProgressLoading, showFeedbackModal, closeFeedbackModal } = useProgressStore();

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
            navigate('/innovation', { replace: true });
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
            const passed = (score / quizQuestions.length) >= 0.7; // Exemplo: 70%

            const alreadyCompleted = useAuthStore.getState().user?.completedPageQuizzes?.includes(PAGE_QUIZ_ID);

            if (passed && !alreadyCompleted) {
                 console.log(`[InnovationQuiz] Chamando completePageQuiz para ${PAGE_QUIZ_ID}`);
                // Chama a função para registrar a conclusão DESTE quiz
                await completePageQuiz(user.uid, PAGE_QUIZ_ID, QUIZ_POINTS);
                 // A verificação geral (checkAndCompleteOnboarding) é chamada DENTRO de completePageQuiz
            } else if (passed && alreadyCompleted){
                 console.log(`[InnovationQuiz] Quiz já completo, verificando estado geral do onboarding...`);
                 await useProgressStore.getState().checkAndCompleteOnboarding(user.uid);
            }
             // Não navega automaticamente aqui, deixa o usuário clicar no botão
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
                <div
                    className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
                    style={{ backgroundImage: "url('/fundo_backdropv2.jpg')" }}
                >
                    <div className="absolute inset-0 bg-brand-green3/80"></div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative max-w-2xl mx-auto text-center p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border">
                        <Award className={`w-20 h-20 mx-auto ${passed ? 'text-brand-green1' : 'text-brand-red'}`} />
                        <h2 className="text-3xl font-bold mt-4">{passed ? 'Parabéns!' : 'Tente novamente!'}</h2>
                        <p className="text-gray-600 mt-2">
                            {passed ? `Você concluiu esta etapa com ${percentage.toFixed(0)}% de acertos!` : `Você não atingiu a pontuação mínima. Estude o conteúdo e tente novamente.`}
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
                                    <strong>Feedback:</strong> {question.explanation}
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