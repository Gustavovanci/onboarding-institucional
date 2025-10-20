// src/pages/QuemSomosQuizPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useProgressStore } from '../stores/progressStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Award } from 'lucide-react';

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

export default function QuemSomosQuizPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { awardBadgeAndPoints, isLoading } = useProgressStore();

    const badgeId = 'quiz-quem-somos';
    const isCompleted = user?.badges.includes(badgeId);

    const [answers, setAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);

    const handleAnswer = (optionIndex: number) => {
        if (answers[currentQuestionIndex] !== null) return;
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setAnswers(newAnswers);
    };

    const handleNext = async () => {
        if (answers[currentQuestionIndex] === null) return;

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setQuizFinished(true);
            const allCorrect = answers.every((ans, i) => ans === quizQuestions[i].correct);
            if (allCorrect && !isCompleted) {
                await awardBadgeAndPoints(user!.uid, badgeId, 'quem-somos');
                 setTimeout(() => {
                    navigate('/dashboard'); // REDIRECIONA PARA O DASHBOARD
                }, 3000);
            } else if (allCorrect && isCompleted) {
                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000);
            }
        }
    };
    
    useEffect(() => {
        if (isCompleted) {
            navigate('/dashboard');
        }
    }, [isCompleted, navigate]);

    const score = answers.reduce((acc, answer, index) => (answer === quizQuestions[index]?.correct ? acc + 1 : acc), 0);
    const passed = score === questions.length;

    if (quizFinished) {
        return (
             <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative max-w-2xl mx-auto text-center p-8 bg-white rounded-2xl shadow-xl border">
                    <Award className={`w-20 h-20 mx-auto ${passed ? 'text-brand-green1' : 'text-brand-red'}`} />
                    <h2 className="text-3xl font-bold mt-4">{passed ? 'Parabéns!' : 'Tente novamente!'}</h2>
                    {passed ? (
                         <p className="text-gray-600 mt-2">Você acertou tudo! Redirecionando para o seu Dashboard...</p>
                    ) : (
                         <p className="text-gray-600 mt-2">Você não atingiu a pontuação necessária. Estude o conteúdo e tente de novo.</p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    {!passed && (
                        <button onClick={() => window.location.reload()} className="btn-secondary w-full">
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
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <div className="relative max-w-2xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div key={currentQuestionIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border">
                <p className="text-sm font-semibold text-brand-azure">Questão {currentQuestionIndex + 1} de {questions.length}</p>
                <h2 className="text-xl sm:text-2xl font-bold mt-2 text-brand-dark">{question.question}</h2>
                <div className="mt-6 space-y-3">
                  {question.options.map((option, index) => {
                    const hasAnswered = answers[currentQuestionIndex] !== null;
                    const isSelected = answers[currentQuestionIndex] === index;
                    const isCorrect = question.correct === index;
                    let stateClasses = 'border-gray-300 hover:border-brand-azure hover:bg-blue-50';
                    if (hasAnswered) {
                      if (isCorrect) stateClasses = 'bg-green-100 border-brand-green1 text-brand-green1 font-semibold';
                      else if (isSelected) stateClasses = 'bg-red-100 border-brand-red text-brand-red font-semibold';
                      else stateClasses = 'border-gray-300 opacity-60';
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
                  {answers[currentQuestionIndex] !== null && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4 p-3 bg-gray-100 rounded-lg text-sm text-gray-700">
                      <strong>Explicação:</strong> {question.explanation}
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="mt-8 text-right">
                  <button onClick={handleNext} disabled={answers[currentQuestionIndex] === null || isLoading} className="btn-primary disabled:opacity-50">
                    {isLoading ? 'Aguarde...' : currentQuestionIndex < questions.length - 1 ? 'Próxima' : 'Finalizar Quiz'}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
    );
}