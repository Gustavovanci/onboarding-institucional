// src/pages/BoasVindasQuizPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useProgressStore } from '../stores/progressStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Award } from 'lucide-react';

const quizQuestions = [
    {
        question: 'Os pacientes SUS atendidos no HC são:',
        options: ['Agendados no próprio HC', 'Referenciados de outras instituições de saúde, considerando a sua complexidade', 'Familiares de colaboradores'],
        correct: 1,
        explanation: 'O Hospital das Clínicas (HC) é um hospital de alta complexidade que recebe pacientes referenciados de outras unidades de saúde. Ou seja, os atendimentos não são feitos por demanda espontânea ou agendamento direto, mas por encaminhamentos realizados através da rede pública de saúde, conforme a gravidade e especialidade necessária.'
    },
    {
        question: 'O nosso Slogan "Orgulho de fazer o melhor para as pessoas com as pessoas" reforça:',
        options: ['a importância das pessoas em todo o processo', 'o nosso orgulho em fazer parte', 'o respeito a todas as pessoas e à diversidade', 'todas as alternativas estão corretas'],
        correct: 3,
        explanation: 'O slogan representa os valores humanos, o trabalho em equipe e o compromisso com o cuidado. Ele expressa tanto o orgulho de pertencer ao HC quanto o respeito e a valorização das pessoas — pacientes, profissionais e a comunidade — que fazem parte dessa missão.'
    }
];

export default function BoasVindasQuizPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { awardBadgeAndPoints, isLoading } = useProgressStore();

    const badgeId = 'checkin-hc';
    const isCompleted = user?.badges.includes(badgeId);

    const [answers, setAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleAnswer = (optionIndex: number) => {
        if (showFeedback) return;
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setAnswers(newAnswers);
        setShowFeedback(true); // Mostra o feedback assim que a resposta é selecionada
    };

    const handleNext = async () => {
        if (!showFeedback) return;

        setShowFeedback(false);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setQuizFinished(true);
            const score = answers.reduce((acc, answer, index) => (answer === quizQuestions[index]?.correct ? acc + 1 : acc), 0);
            const passed = score / questions.length >= 0.7; // Usa uma taxa de acerto de 70%

            if (passed && !isCompleted) {
                // Concede o badge apenas na primeira vez que passa
                await awardBadgeAndPoints(user!.uid, badgeId, 'boas-vindas');
            }
            // Se passou, espera para mostrar o resultado e depois redireciona
            if(passed) {
                setTimeout(() => {
                    navigate('/quem-somos');
                }, 2000);
            }
        }
    };
    
    useEffect(() => {
        if (isCompleted) {
            navigate('/quem-somos');
        }
    }, [isCompleted, navigate]);

    const score = answers.reduce((acc, answer, index) => (answer === quizQuestions[index]?.correct ? acc + 1 : acc), 0);
    const percentage = quizFinished ? (score / questions.length) * 100 : 0;
    const passed = percentage >= 70;

    if (quizFinished) {
        return (
             <div 
                className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
                style={{ backgroundImage: "url('/fundo_backdropv2.jpg')" }}
            >
                <div className="absolute inset-0 bg-brand-green3/80"></div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative max-w-2xl mx-auto text-center p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border">
                    <Award className={`w-20 h-20 mx-auto ${passed ? 'text-brand-green1' : 'text-brand-red'}`} />
                    <h2 className="text-3xl font-bold mt-4">{passed ? 'Parabéns!' : 'Tente novamente!'}</h2>
                    {passed ? (
                         <p className="text-gray-600 mt-2">Você concluiu esta etapa! Redirecionando para o próximo passo...</p>
                    ) : (
                         <p className="text-gray-600 mt-2">Você não atingiu a pontuação mínima (70%). Estude o conteúdo e tente novamente para ganhar seus pontos.</p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    {!passed && (
                        <button onClick={() => window.location.reload()} className="btn-primary w-full">
                            Tentar Novamente
                        </button>
                    )}
                    </div>
                </motion.div>
            </div>
       )
    }

    const question = questions[currentQuestionIndex];
    
    return (
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
                        <p className="text-sm font-semibold text-brand-azure">Questão {currentQuestionIndex + 1} de {questions.length}</p>
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
                                    {showFeedback && isCorrect && <CheckCircle className="w-5 h-5" />}
                                    {showFeedback && isSelected && !isCorrect && <XCircle className="w-5 h-5" />}
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
                                        disabled={isLoading} 
                                        className="btn-primary disabled:opacity-50"
                                    >
                                        {isLoading ? 'Aguarde...' : currentQuestionIndex < questions.length - 1 ? 'Próxima' : 'Finalizar'}
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