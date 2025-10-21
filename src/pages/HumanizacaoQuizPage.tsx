// src/pages/HumanizacaoQuizPage.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useProgressStore } from '../stores/progressStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Award } from 'lucide-react';

const quizQuestions = [
    {
        question: "Onde está localizado o Núcleo Técnico e Científico de Humanização (NH) do HCFMUSP?",
        options: [
            "No térreo do Hospital das Clínicas",
            "No sexto andar do Instituto de Gestão e Saúde",
            "No prédio da Faculdade de Medicina da USP",
            "No Centro de Pesquisa em Saúde"
        ],
        correct: 1,
        explanation: "O NH está instalado no sexto andar do Instituto de Gestão e Saúde do HCFMUSP e integra a Diretoria Clínica, promovendo políticas e ações de humanização para usuários, estudantes e profissionais da saúde."
    },
    {
        question: "Qual das seguintes funções NÃO é uma responsabilidade do NH?",
        options: [
            "Desenvolver indicadores de humanização e monitorá-los",
            "Supervisionar a Ouvidoria Geral do HC",
            "Realizar cirurgias de alta complexidade",
            "Elaborar material técnico e científico sobre humanização"
        ],
        correct: 2,
        explanation: "O NH atua na promoção da humanização na assistência, ensino, gestão e pesquisa, mas não realiza procedimentos clínicos como cirurgias. Suas funções incluem desenvolver indicadores, coordenar projetos e supervisionar a Ouvidoria Geral do HC."
    },
    {
        question: "Por que a humanização é considerada importante na saúde?",
        options: [
            "Para melhorar a estética dos hospitais",
            "Para garantir rapidez no atendimento, independentemente da ética",
            "Para promover relações éticas, empáticas e colaborativas",
            "Para substituir protocolos técnicos por opiniões subjetivas"
        ],
        correct: 2,
        explanation: "A humanização concentra esforços na qualidade ética e empática das relações interpessoais na atenção, gestão e ensino, promovendo valores como respeito mútuo e trabalho colaborativo para o bem comum."
    }
];

export default function HumanizacaoQuizPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { completeModule, isLoading } = useProgressStore();

    const moduleId = 'humanizacao';
    const initialIsCompleted = useRef(user?.completedModules?.includes(moduleId));
    const isCompleted = user?.completedModules?.includes(moduleId);

    const [answers, setAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    useEffect(() => {
        if (initialIsCompleted.current) {
            navigate('/humanizacao', { replace: true });
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
        if (!showFeedback) return;

        const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

        if (isLastQuestion) {
            setQuizFinished(true);
            const score = answers.reduce((acc, answer, index) => (answer === quizQuestions[index]?.correct ? acc + 1 : acc), 0);
            const passed = (score / quizQuestions.length) >= 0.7;

            const currentUserIsCompleted = useAuthStore.getState().user?.completedModules?.includes(moduleId);

            if (passed && !currentUserIsCompleted && user) {
                await completeModule(user.uid, { id: moduleId, points: 100, isRequired: true }); // Use os pontos definidos no seed
                initialIsCompleted.current = true;
            }
        } else {
            setShowFeedback(false);
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const score = answers.reduce((acc, answer, index) => (answer === quizQuestions[index]?.correct ? acc + 1 : acc), 0);
    const percentage = quizFinished ? (score / quizQuestions.length) * 100 : 0;
    const passed = percentage >= 70;

    // --- Tela de Finalização ---
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
                         <p className="text-gray-600 mt-2">Você concluiu esta etapa com {percentage.toFixed(0)}% de acertos!</p>
                    ) : (
                         <p className="text-gray-600 mt-2">Você não atingiu a pontuação mínima ({percentage.toFixed(0)}%). Estude o conteúdo e tente novamente.</p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    {!passed ? (
                        <button onClick={() => window.location.reload()} className="btn-secondary w-full">
                            Tentar Novamente
                        </button>
                    ) : (
                        <button onClick={() => navigate('/modules')} className="btn-primary w-full">
                            Continuar Trilha
                        </button>
                    )}
                    </div>
                </motion.div>
            </div>
        )
    }

    // --- Tela do Quiz ---
    const question = quizQuestions[currentQuestionIndex];

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
                                        disabled={isLoading}
                                        className="btn-primary disabled:opacity-50"
                                    >
                                        {isLoading ? 'Aguarde...' : currentQuestionIndex < quizQuestions.length - 1 ? 'Próxima' : 'Finalizar'}
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