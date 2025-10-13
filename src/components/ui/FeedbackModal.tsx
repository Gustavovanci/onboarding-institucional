// src/components/ui/FeedbackModal.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageSquare, CheckCircle } from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';
import { useAuthStore } from '@/stores/authStore';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const npsRatings = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// A CORREÇÃO ESTÁ AQUI: Usando 'export default'
export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { addFeedback, isLoading } = useProgressStore();
  const { user } = useAuthStore();
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!user || rating === null) return;
    await addFeedback({
      userId: user.uid,
      rating,
      message,
    });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      // Resetar estado para a próxima vez que o modal abrir
      setTimeout(() => {
        setSubmitted(false);
        setRating(null);
        setMessage('');
      }, 500);
    }, 2000);
  };

  const getRatingColor = (r: number) => {
    if (r <= 6) return 'bg-brand-red';
    if (r <= 8) return 'bg-yellow-500';
    return 'bg-brand-green1';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-8"
          >
            {submitted ? (
              <div className="text-center flex flex-col items-center justify-center h-64">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
                  <CheckCircle className="w-16 h-16 text-brand-green1 mx-auto mb-4" />
                </motion.div>
                <h2 className="text-2xl font-bold">Obrigado pelo seu feedback!</h2>
                <p className="text-gray-500 mt-2">Sua jornada continua!</p>
              </div>
            ) : (
              <>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors">
                  <X />
                </button>
                <h2 className="text-2xl font-bold text-center mb-1">Deixe seu Feedback</h2>
                <p className="text-center text-gray-500 mb-6">Sua opinião é muito importante para nós.</p>
                
                <div className="mb-6">
                  <label className="font-semibold text-gray-700 mb-3 block text-center">
                    Em uma escala de 0 a 10, o quanto você recomendaria este onboarding?
                  </label>
                  <div className="flex justify-center gap-1 flex-wrap">
                    {npsRatings.map(r => (
                      <button
                        key={r}
                        onClick={() => setRating(r)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full font-bold text-white transition-all transform focus:outline-none ${
                          rating === r 
                            ? `${getRatingColor(r)} scale-110 shadow-lg` 
                            : `bg-gray-200 hover:bg-gray-300 text-gray-700 hover:scale-105`
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MessageSquare className="text-brand-azure" />
                    Deixe uma mensagem para os próximos colaboradores
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ex: Seja bem-vindo(a)! Aproveite cada momento..."
                    className="w-full p-3 h-24 border-2 border-gray-200 rounded-xl focus:border-brand-azure focus:ring-0 transition"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading || rating === null}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send size={18} />
                  {isLoading ? 'Enviando...' : 'Enviar Feedback'}
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}