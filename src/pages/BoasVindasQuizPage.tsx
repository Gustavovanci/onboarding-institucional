// src/pages/BoasVindasQuizPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useProgressStore } from '../stores/progressStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';
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

// ==================================================================
// == A CORREÇÃO ESTÁ AQUI: Verifique se 'export default' está presente.
// ==================================================================
export default function BoasVindasQuizPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { awardBadgeAndPoints, isLoading } = useProgressStore();
    const [answers, setAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
    const [submitted, setSubmitted] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const hasCompletedCheckin = user?.badges.includes('checkin-hc');

    const handleAnswer = (qIndex: number, aIndex: number) => {
        if (showResults) return;
        const newAnswers = [...answers];
        newAnswers[qIndex] = aIndex;
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        if (answers.some(a => a === null)) {
            alert('Por favor, responda todas as perguntas.');
            return;
        }
        setShowResults(true);
        
        const isCorrect = answers.every((ans, i) => ans === quizQuestions[i].correct);

        if (!hasCompletedCheckin && isCorrect) {
            await awardBadgeAndPoints(user!.uid, 'checkin-hc');
        }

        setTimeout(() => {
            setSubmitted(true);
            setTimeout(() => navigate('/dashboard'), 3000);
        }, 4000);
    };
    
    if (hasCompletedCheckin && !submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center p-4 bg-gray-100">
                <div className="card-elevated">
                    <CheckCircle className="w-16 h-16 mx-auto text-brand-green1" />
                    <h2 className="text-2xl font-bold mt-4">Check-in Concluído!</h2>
                    <p className="text-gray-600 mt-2">Você já completou a etapa de Boas-Vindas.</p>
                    <button onClick={() => navigate('/dashboard')} className="btn-primary mt-6">Voltar ao Início</button>
                </div>
            </div>
        );
    }

    if (submitted) {
         return (
            <div className="min-h-screen flex items-center justify-center text-center p-4 bg-green-50">
                <motion.div initial={{opacity: 0, scale: 0.8}} animate={{opacity: 1, scale: 1}}>
                    <Award className="w-24 h-24 mx-auto text-yellow-500" />
                    <h2 className="text-3xl font-bold mt-6">Parabéns, {user?.displayName?.split(' ')[0]}!</h2>
                    <p className="text-lg text-gray-700 mt-2">Você concluiu a etapa de Boas-Vindas e ganhou o badge "Iniciante HC" e 100 pontos!</p>
                    <p className="text-gray-500 mt-4">Redirecionando para o painel principal...</p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center">
            <div className="max-w-3xl w-full">
                <h1 className="text-3xl font-bold text-center mb-8">Quiz Boas-Vindas</h1>
                <div className="space-y-8">
                    {quizQuestions.map((q, qIndex) => (
                        <div key={qIndex} className="card-elevated p-6">
                            <p className="font-semibold text-lg">{qIndex + 1}. {q.question}</p>
                            <div className="mt-4 space-y-3">
                                {q.options.map((option, aIndex) => {
                                    const isSelected = answers[qIndex] === aIndex;
                                    const isCorrect = q.correct === aIndex;
                                    let stateClasses = 'border-gray-300 hover:border-brand-azure hover:bg-blue-50';
                                    if(showResults){
                                        if(isCorrect) stateClasses = 'bg-green-100 border-green-500 text-green-800 font-semibold';
                                        else if(isSelected) stateClasses = 'bg-red-100 border-red-500 text-red-800';
                                    } else if (isSelected) {
                                        stateClasses = 'bg-blue-100 border-brand-azure';
                                    }

                                    return (
                                    <button 
                                        key={aIndex} 
                                        onClick={() => handleAnswer(qIndex, aIndex)}
                                        disabled={showResults}
                                        className={`w-full text-left p-4 border-2 rounded-lg transition-all flex items-center justify-between ${stateClasses}`}
                                    >
                                        <span>{option}</span>
                                        {showResults && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                                        {showResults && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                                    </button>
                                )})}
                            </div>
                            <AnimatePresence>
                                {showResults && (
                                    <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="mt-4 p-3 bg-gray-100 rounded-lg text-sm">
                                        <strong>Feedback:</strong> {q.explanation}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
                <div className="mt-8 text-center">
                    <button onClick={handleSubmit} disabled={isLoading || showResults} className="btn-primary text-lg w-full sm:w-auto disabled:opacity-50">
                        {isLoading ? 'Aguarde...' : 'Finalizar Quiz'}
                    </button>
                </div>
            </div>
        </div>
    );
}