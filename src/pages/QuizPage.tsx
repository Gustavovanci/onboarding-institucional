// 🔹 ARQUIVO: src/pages/QuizPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuthStore } from '../stores/authStore';
import { useProgressStore } from '../stores/progressStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Award } from 'lucide-react';

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
type AnswerStatus = 'unanswered' | 'correct' | 'incorrect';

export default function QuizPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { completeModule } = useProgressStore();

  const [questions, setQuestions] = useState<QuizItem[]>([]);
  const [moduleData, setModuleData] = useState<ModuleData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!moduleId) return;
      setIsLoading(true);
      try {
        const moduleRef = doc(db, 'modules', moduleId);
        const moduleSnap = await getDoc(moduleRef);
        if (moduleSnap.exists()) setModuleData(moduleSnap.data() as ModuleData);

        const q = query(collection(db, 'modules', moduleId, 'quiz'), orderBy('order'));
        const querySnapshot = await getDocs(q);
        const fetchedQuestions = querySnapshot.docs.map(doc => ({
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

  // Verificação ao finalizar
  useEffect(() => {
    if (!quizFinished || !user || !moduleData || !moduleId) return;

    const score = answers.reduce(
      (acc, answer, index) => (answer === questions[index]?.correct ? acc + 1 : acc),
      0
    );
    const percentage = (score / questions.length) * 100;
    const passed = percentage >= 70;

    if (passed && !user.completedModules.includes(moduleId)) {
      completeModule(user.uid, {
        id: moduleId,
        points: moduleData.points,
        isRequired: moduleData.isRequired,
      });
    }
  }, [quizFinished, user, moduleData, moduleId, answers, questions, completeModule]);

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
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  if (questions.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-8">
        <div>
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Módulo Concluído!</h2>
          <p className="text-gray-600 mt-2">
            Este módulo não possui um quiz. Você já ganhou os pontos.
          </p>
          <button
            onClick={() => navigate('/modules')}
            className="btn-primary mt-6"
          >
            Voltar para a Trilha
          </button>
        </div>
      </div>
    );

  const question = questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestionIndex];
  const score = answers.reduce(
    (acc, answer, index) => (answer === questions[index]?.correct ? acc + 1 : acc),
    0
  );
  const percentage = (score / questions.length) * 100;
  const passed = percentage >= 70;

  if (quizFinished) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 bg-gray-50"
        style={{
          backgroundImage: "url('/fundo_backdropv2.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border"
        >
          <Award
            className={`w-20 h-20 mx-auto ${
              passed ? 'text-brand-green1' : 'text-brand-red'
            }`}
          />
          <h2 className="text-3xl font-bold mt-4">
            {passed ? 'Parabéns!' : 'Tente novamente!'}
          </h2>
          <p className="text-xl mt-2">
            Sua pontuação: <span className="font-bold">{percentage.toFixed(0)}%</span>
          </p>
          <p className="text-gray-600 mt-2">
            {passed
              ? 'Você atingiu a pontuação mínima e concluiu o módulo!'
              : 'Você precisa de 70% para aprovação. Estude o conteúdo e tente de novo.'}
          </p>
          <div className="flex gap-4 mt-8">
            {!passed && (
              <button onClick={() => window.location.reload()} className="btn-secondary w-full">
                Tentar Novamente
              </button>
            )}
            <button onClick={() => navigate('/modules')} className="btn-primary w-full">
              Voltar para a Trilha
            </button>
          </div>
        </motion.div>
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
      <div className="max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border"
          >
            <p className="text-sm font-semibold text-brand-azure">
              Questão {currentQuestionIndex + 1} de {questions.length}
            </p>
            <h2 className="text-2xl font-bold mt-2 text-brand-dark">
              {question.question}
            </h2>

            <div className="mt-6 space-y-3">
              {question.options.map((option, index) => {
                let status: AnswerStatus = 'unanswered';
                if (selectedAnswer !== null) {
                  if (index === question.correct && selectedAnswer === question.correct)
                    status = 'correct';
                  else if (index === selectedAnswer && selectedAnswer !== question.correct)
                    status = 'incorrect';
                }

                const baseClasses =
                  'w-full text-left p-4 border-2 rounded-lg transition-all flex items-center justify-between disabled:cursor-default';
                const statusClasses = {
                  unanswered:
                    'border-gray-300 hover:border-brand-azure hover:bg-blue-50',
                  correct:
                    'bg-green-100 border-brand-green1 text-brand-green1 font-semibold animate-pulse',
                  incorrect:
                    'bg-red-100 border-brand-red text-brand-red font-semibold',
                };

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`${baseClasses} ${statusClasses[status]}`}
                    whileTap={{ scale: 0.98 }}
                    whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                  >
                    <span>{option}</span>
                    {status === 'correct' && (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    {status === 'incorrect' && <XCircle className="w-5 h-5" />}
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback condicional */}
            {selectedAnswer !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-gray-100 rounded-lg text-sm text-gray-700"
              >
                {selectedAnswer === question.correct ? (
                  <span className="text-brand-green1 font-semibold">
                    🎉 Boa! Você acertou!
                  </span>
                ) : (
                  <>
                    <strong>Explicação:</strong> {question.explanation}
                  </>
                )}
              </motion.div>
            )}

            <div className="mt-8 text-right">
              <button
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className="btn-primary"
              >
                {currentQuestionIndex < questions.length - 1
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
