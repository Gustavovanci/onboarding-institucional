// src/pages/QuemSomosQuizPage.tsx
import { useState, useEffect, useRef } from 'react'; // Import useRef
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useProgressStore } from '../stores/progressStore'; // Import progressStore
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Award } from 'lucide-react';
import FeedbackModal from '../components/ui/FeedbackModal'; // Import FeedbackModal

const quizQuestions = [
    {
        question: 'A Missão expressa o propósito e a razão de existir da Instituição. Com base nisso, qual das opções abaixo representa corretamente a Missão?',
        options: [
            'Ser uma Instituição de excelência, reconhecida nacional e internacionalmente.',
            'Fazer o melhor para as pessoas, com as pessoas!',
            'Promover o desenvolvimento tecnológico e científico do país.',
            'Atuar com ética, humanismo e responsabilidade social.'
        ],
        correct: 1,
        explanation: 'A Missão reflete o propósito essencial da Instituição — o que ela faz e para quem. Neste caso, o foco é fazer o melhor para as pessoas, com as pessoas, destacando o compromisso com o trabalho colaborativo e o bem-estar coletivo.'
    },
    {
        question: 'Os valores orientam atitudes e comportamentos dentro da Instituição. Qual das alternativas contém apenas valores conforme o conteúdo apresentado?',
        options: [
            'Ética, Humanismo, Responsabilidade Social, Pluralismo, Pioneirismo e Compromisso Institucional.',
            'Ensino, Pesquisa, Assistência e Inovação.',
            'Fazer o melhor para as pessoas, com as pessoas!',
            'Ser uma Instituição de excelência, reconhecida nacional e internacionalmente.'
        ],
        correct: 0,
        explanation: 'Esses são os valores fundamentais que norteiam as ações da Instituição. Eles refletem princípios éticos, sociais e humanos, além do comprometimento com a inovação e a pluralidade.'
    }
];

const PAGE_QUIZ_ID = 'quem-somos'; // ID único
const QUIZ_POINTS = 50; // Pontos para este quiz (do antigo badge quiz-quem-somos)

export default function QuemSomosQuizPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    // Usa funções do progressStore
    const { completePageQuiz, checkAndCompleteOnboarding, isLoading: isProgressLoading, showFeedbackModal, closeFeedbackModal } = useProgressStore();

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
            navigate('/quem-somos', { replace: true });
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

        const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

        if (isLastQuestion) {
            setQuizFinished(true);
            const score = answers.reduce((acc, answer, index) => (answer === quizQuestions[index].correct ? acc + 1 : acc), 0);
            const passed = (score / quizQuestions.length) >= 0.7; // Exemplo: 70%

            const alreadyCompleted = useAuthStore.getState().user?.completedPageQuizzes?.includes(PAGE_QUIZ_ID);

            if (passed && !alreadyCompleted) {
                // Chama a função do store para registrar a conclusão DESTE quiz
                await completePageQuiz(user.uid, PAGE_QUIZ_ID, QUIZ_POINTS);
                // A verificação geral (checkAndCompleteOnboarding) é chamada DENTRO de completePageQuiz
            } else if (passed && alreadyCompleted){
                 // Se já estava completo e passou de novo, apenas verifica o onboarding geral
                 await checkAndCompleteOnboarding(user.uid);
            }
        } else {
            setShowFeedback(false);
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const score = answers.reduce((acc, answer, index) => (answer === quizQuestions[index]?.correct ? acc + 1 : acc), 0);
    const percentage = quizFinished ? (score / quizQuestions.length) * 100 : 0;
    const passed = percentage >= 70; // Usa a mesma condição de aprovação

    // --- Tela de Finalização ---
    if (quizFinished) {
        return (
             <>
                {/* Renderiza o Modal de Feedback se o estado global for true */}
                <FeedbackModal
                  isOpen={showFeedbackModal}
                  onClose={() => {
                    closeFeedbackModal(); // Fecha o modal via store
                    navigate('/certificates'); // Navega após fechar
                  }}
                />
                {/* Tela de Resultado do Quiz */}
                <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50" style={{ backgroundImage: "url('/fundo_backdropv2.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div className="absolute inset-0 bg-brand-green3/80"></div>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative max-w-2xl mx-auto text-center p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border">
                        <Award className={`w-20 h-20 mx-auto ${passed ? 'text-brand-green1' : 'text-brand-red'}`} />
                        <h2 className="text-3xl font-bold mt-4">{passed ? 'Quiz Concluído!' : 'Tente novamente!'}</h2>
                        <p className="text-gray-600 mt-2">
                            {passed ? `Você concluiu com ${percentage.toFixed(0)}% de acertos!` : `Você atingiu ${percentage.toFixed(0)}%, mas o mínimo é 70%. Estude o conteúdo e tente novamente.`}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mt-8">
                            {!passed && (
                                <button onClick={() => window.location.reload()} className="btn-secondary w-full">
                                Tentar Novamente
                                </button>
                            )}
                            {/* Só mostra "Continuar Trilha" se o modal de feedback NÃO estiver ativo */}
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
    const question = quizQuestions[currentQuestionIndex];

    return (
        <>
            {/* Tela das Questões */}
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50" style={{ backgroundImage: "url('/fundo_backdropv2.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="absolute inset-0 bg-brand-green3/50"></div>
            <div className="relative max-w-2xl mx-auto w-full">
                <AnimatePresence mode="wait">
                <motion.div key={currentQuestionIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl border">
                    <p className="text-sm font-semibold text-brand-azure">Questão {currentQuestionIndex + 1} de {quizQuestions.length}</p>
                    <h2 className="text-xl sm:text-2xl font-bold mt-2 text-brand-dark">{question.question}</h2>
                    <div className="mt-6 space-y-3">
                    {question.options.map((option, index) => {
                        const isSelected = answers[currentQuestionIndex] === index;
                        const isCorrect = question.correct === index;
                        let stateClasses = 'border-gray-300 hover:border-brand-azure hover:bg-blue-50';
                        if (showFeedback) { // Feedback da questão atual
                        if (isCorrect) stateClasses = 'bg-green-100 border-brand-green1 text-brand-green1 font-semibold';
                        else if (isSelected) stateClasses = 'bg-red-100 border-brand-red text-brand-red font-semibold';
                        else stateClasses = 'border-gray-300 opacity-60';
                        } else if (isSelected) {
                             stateClasses = 'bg-blue-100 border-brand-azure';
                        }
                        return (
                        <motion.button key={index} onClick={() => handleAnswer(index)} disabled={showFeedback} className={`w-full text-left p-4 border-2 rounded-lg transition-all duration-200 flex items-center justify-between disabled:cursor-not-allowed ${stateClasses}`}>
                            <span>{option}</span>
                            {showFeedback && isCorrect && <CheckCircle className="w-5 h-5" />}
                            {showFeedback && isSelected && !isCorrect && <XCircle className="w-5 h-5" />}
                        </motion.button>
                        );
                    })}
                    </div>
                    <AnimatePresence>
                    {showFeedback && ( // Botão Próxima/Finalizar
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4">
                            <div className="p-3 bg-gray-100 rounded-lg text-sm text-gray-700">
                                <strong>Explicação:</strong> {question.explanation}
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
            {/* Modal Global */}
            <FeedbackModal
                isOpen={showFeedbackModal}
                onClose={() => {
                    closeFeedbackModal();
                    navigate('/certificates');
                }}
            />
        </>
    );
}