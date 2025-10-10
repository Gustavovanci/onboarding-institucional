import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface StaticOnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
}

export const StaticOnboardingTour = ({ isOpen, onClose, images }: StaticOnboardingTourProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback para caso o array de imagens esteja vazio
  const imageList = images.length > 0 ? images : ['/tour/placeholder.png'];

  const handleNext = () => {
    if (currentIndex < imageList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!isOpen) {
    return null;
  }

  const isLastStep = currentIndex === imageList.length - 1;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700"
      >
        {/* Área da Imagem com Fallback */}
        <div className="relative bg-gray-100 dark:bg-gray-900 aspect-[16/9] flex items-center justify-center text-gray-500">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={imageList[currentIndex]}
              alt={`Passo do Tour ${currentIndex + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full object-contain z-10"
              // Oculta a imagem se ela quebrar, mostrando o texto de fallback
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </AnimatePresence>
          {/* Mensagem de Fallback */}
          <span>Carregando passo {currentIndex + 1}... (Imagem não encontrada)</span>
        </div>

        {/* Botão de Fechar (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/30 text-white rounded-full p-2 hover:bg-black/60 transition-colors z-20"
          aria-label="Fechar tour"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Barra de Navegação Inferior */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          {/* Pontos de Progresso */}
          <div className="flex items-center gap-2">
            {imageList.map((_, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentIndex ? 'bg-blue-500 scale-125' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-lg font-semibold transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Botão dinâmico: Próximo ou Finalizar */}
            {isLastStep ? (
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg font-semibold transition-colors bg-green-500 text-white hover:bg-green-600 flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Finalizar
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 rounded-lg font-semibold transition-colors bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
              >
                Próximo
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};