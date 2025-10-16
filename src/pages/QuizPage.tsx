// src/pages/QuizPage.tsx
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuthStore } from '../stores/authStore';
import { useProgressStore } from '../stores/progressStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import FeedbackModal from '../components/ui/FeedbackModal';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Award, ArrowLeft } from 'lucide-react';

interface QuizItem {
  id: string;
  order: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}
interface ModuleData {
  title: string;
  points: number;
  isRequired: boolean;
}

export default function QuizPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { completeModule, isLoading: isProgressLoading } = useProgressStore();

  const [questions, setQuestions] = useState<QuizItem[]>([]);
  const [moduleData, setModuleData] = useState<ModuleData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const handleCompleteModule = useCallback(
    async (passed: boolean) => {
      if (!user || !moduleData || !moduleId || !passed) return;

      const isAlreadyCompleted = user.completedModules.includes(moduleId);

      if (!isAlreadyCompleted) {
        // CORREÇÃO: A lógica complexa foi removida.
        // A função 'completeModule' agora retorna um booleano se a trilha foi finalizada.
        const isFinished = await completeModule(user.uid, {
          id: moduleId,
          points: moduleData.points,
          isRequired: moduleData.isRequired,
        });

        // Se a função retornar 'true', significa que todos os módulos obrigatórios foram concluídos.
        if (isFinished) {
          setShowFeedbackModal(true);
        }
      }
    },
    [user, moduleData, moduleId, completeModule]
  );

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!moduleId) return;
      setIsLoading(true);
      try {
        const moduleRef = doc(db, 'modules', moduleId);
        const moduleSnap = await getDoc(moduleRef);
        if (moduleSnap.exists()) {
          setModuleData(moduleSnap.data() as ModuleData);
        }

        const q = query(
          collection(db, 'modules', moduleId, 'quiz'),
          orderBy('order')
        );
        const querySnapshot = await getDocs(q);
        const fetchedQuestions = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as QuizItem[];

        setQuestions(fetchedQuestions);
        setAnswers(new Array(fetchedQuestions.length).fill(null));
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, [moduleId]);

  const handleAnswer = (optionIndex: number) => {
    if (answers[currentQuestionIndex] !== null) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (answers[currentQuestionIndex] === null) return;

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
      const score = answers.reduce(
        (acc, answer, index) =>
          answer === questions[index]?.correct ? acc + 1 : acc,
        0
      );
      const percentage =
        questions.length > 0 ? (score / questions.length) * 100 : 100;
      handleCompleteModule(percentage >= 70);
    }
  };

  useEffect(() => {
    if (!isLoading && questions.length === 0 && !quizFinished) {
      setQuizFinished(true);
      handleCompleteModule(true);
    }
  }, [isLoading, questions, quizFinished, handleCompleteModule]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const score = answers.reduce(
    (acc, answer, index) =>
      answer === questions[index]?.correct ? acc + 1 : acc,
    0
  );
  const percentage =
    questions.length > 0 ? (score / questions.length) * 100 : 100;
  const passed = percentage >= 70;

  if (quizFinished) {
    return (
      <>
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => {
            setShowFeedbackModal(false);
            // Leva o usuário para a página de certificados após o feedback
            navigate('/certificates');
          }}
        />
        <div
          className="min-h-screen flex items-center justify-center p-4 bg-gray-50"
          style={{
            backgroundImage: "url('/fundo_backdropv2.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-brand-green3/80"></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-2xl mx-auto text-center p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border"
          >
            {questions.length > 0 ? (
              <>
                <Award
                  className={`w-20 h-20 mx-auto ${
                    passed ? 'text-brand-green1' : 'text-brand-red'
                  }`}
                />
                <h2 className="text-3xl font-bold mt-4">
                  {passed ? 'Parabéns!' : 'Tente novamente!'}
                </h2>
                <p className="text-xl mt-2">
                  Sua pontuação:{' '}
                  <span className="font-bold">{percentage.toFixed(0)}%</span>
                </p>
                <p className="text-gray-600 mt-2">
                  {passed
                    ? 'Você atingiu a pontuação mínima e concluiu o módulo!'
                    : 'Você precisa de 70% para aprovação. Estude o conteúdo e tente de novo.'}
                </p>
              </>
            ) : (
              <>
                <CheckCircle className="w-20 h-20 mx-auto text-brand-green1" />
                <h2 className="text-3xl font-bold mt-4">Módulo Concluído!</h2>
                <p className="text-gray-600 mt-2">
                  Este módulo não possui um quiz. Os pontos já foram adicionados.
                </p>
              </>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              {!passed && questions.length > 0 && (
                <button
                  onClick={() => window.location.reload()}
                  className="btn-secondary w-full"
                >
                  Tentar Novamente
                </button>
              )}
              <button
                onClick={() => {
                  if (!showFeedbackModal) navigate('/modules');
                }}
                className="btn-primary w-full"
              >
                Voltar para a Trilha
              </button>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  const question = questions[currentQuestionIndex];
  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-gray-50"
      style={{
        backgroundImage: "url('/fundo_backdropv2.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
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
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-semibold text-brand-azure">
                Questão {currentQuestionIndex + 1} de {questions.length}
              </p>
              <button
                onClick={() => navigate(`/modules/${moduleId}`)}
                className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-colors"
              >
                <ArrowLeft size={16} /> Voltar ao Módulo
              </button>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mt-2 text-brand-dark">
              {question.question}
            </h2>
            <div className="mt-6 space-y-3">
              {question.options.map((option, index) => {
                const hasAnswered = answers[currentQuestionIndex] !== null;
                const isSelected = answers[currentQuestionIndex] === index;
                const isCorrect = question.correct === index;
                let stateClasses =
                  'border-gray-300 hover:border-brand-azure hover:bg-blue-50';
                if (hasAnswered) {
                  if (isCorrect)
                    stateClasses =
                      'bg-green-100 border-brand-green1 text-brand-green1 font-semibold';
                  else if (isSelected)
                    stateClasses =
                      'bg-red-100 border-brand-red text-brand-red font-semibold';
                  else stateClasses = 'border-gray-300 opacity-60';
                }
                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={hasAnswered}
                    className={`w-full text-left p-4 border-2 rounded-lg transition-all duration-200 flex items-center justify-between disabled:cursor-not-allowed ${stateClasses}`}
                  >
                    <span>{option}</span>
                    {hasAnswered && isCorrect && (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    {hasAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5" />
                    )}
                  </motion.button>
                );
              })}
            </div>
            <AnimatePresence>
              {answers[currentQuestionIndex] !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 p-3 bg-gray-100 rounded-lg text-sm text-gray-700"
                >
                  <strong>Explicação:</strong> {question.explanation}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="mt-8 text-right">
              <button
                onClick={handleNext}
                disabled={
                  answers[currentQuestionIndex] === null || isProgressLoading
                }
                className="btn-primary disabled:opacity-50"
              >
                {isProgressLoading
                  ? 'Aguarde...'
                  : currentQuestionIndex < questions.length - 1
                  ? 'Próxima'
                  : 'Finalizar Quiz'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}