// src/pages/InnovationQuizPage.tsx
import { useState, useEffect, useRef } from 'react'; // Import useRef
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useProgressStore } from '../stores/progressStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Award } from 'lucide-react';

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

export default function InnovationQuizPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { completeModule, isLoading } = useProgressStore();

    const moduleId = 'inovahc';
    const initialIsCompleted = useRef(user?.completedModules?.includes(moduleId)); // ✅ Guarda o estado inicial
    const isCompleted = user?.completedModules?.includes(moduleId);

    const [answers, setAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    // ✅ CORREÇÃO APLICADA: Redireciona APENAS se o quiz JÁ ESTAVA completo ao carregar a página
    useEffect(() => {
        // Usa o valor inicial guardado no useRef. Se era true no início, redireciona.
        if (initialIsCompleted.current) {
            navigate('/innovation', { replace: true });
        }
        // O array vazio [] garante que este efeito só roda uma vez no carregamento inicial.
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
            setQuizFinished(true); // Mostra a tela final
            const score = answers.reduce((acc, answer, index) => (answer === quizQuestions[index]?.correct ? acc + 1 : acc), 0);
            const passed = (score / quizQuestions.length) >= 0.7;

            // Verifica se o usuário ATUAL (do useAuthStore) ainda não tem o módulo como completo
            // Isso evita chamar completeModule múltiplas vezes se o estado demorar a atualizar
            const currentUserIsCompleted = useAuthStore.getState().user?.completedModules?.includes(moduleId);

            if (passed && !currentUserIsCompleted && user) {
                 await completeModule(user.uid, { id: moduleId, points: 100, isRequired: true });
                 // Atualiza a referência inicial para evitar redirecionamento futuro nesta sessão se o usuário voltar
                 initialIsCompleted.current = true;
            }
        } else {
            setShowFeedback(false);
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    // --- Cálculo de Score (sem mudanças) ---
    const score = answers.reduce((acc, answer, index) => (answer === quizQuestions[index]?.correct ? acc + 1 : acc), 0);
    const percentage = quizFinished ? (score / quizQuestions.length) * 100 : 0;
    const passed = percentage >= 70;

    // --- Tela de Finalização Padrão (sem mudanças) ---
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
                         <p className="text-gray-600 mt-2">Você não atingiu a pontuação mínima. Estude o conteúdo e tente novamente.</p>
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

    // --- Tela do Quiz Padrão (sem mudanças) ---
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