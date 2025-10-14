// src/components/ui/StaticOnboardingTour.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, CheckCircle, ImageOff } from 'lucide-react';

interface StaticOnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
}

export const StaticOnboardingTour = ({ isOpen, onClose, images }: StaticOnboardingTourProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Reseta o estado de erro quando o tour é aberto ou a imagem muda
    if (isOpen) {
      setImageError(false);
    }
  }, [isOpen, currentIndex]);

  if (!isOpen) {
    return null;
  }

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const isLastStep = currentIndex === images.length - 1;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700"
      >
        <div className="relative bg-gray-100 dark:bg-gray-900 aspect-[16/9] flex items-center justify-center text-gray-500">
          <AnimatePresence mode="wait">
            {imageError ? (
              <motion.div key="error" className="flex flex-col items-center text-red-500 z-20 p-4 text-center">
                <ImageOff className="w-12 h-12 mb-2" />
                <p className="font-semibold">Erro ao carregar a imagem do tour</p>
                <p className="text-xs">Verifique se o arquivo <code className="bg-red-100 p-1 rounded text-red-800">{images[currentIndex]}</code> existe na pasta `public/tour`.</p>
              </motion.div>
            ) : (
              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                alt={`Passo do Tour ${currentIndex + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 w-full h-full object-contain z-10"
                onError={() => setImageError(true)}
              />
            )}
          </AnimatePresence>
          {!imageError && <span className="z-0">Carregando imagem do tour...</span>}
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/30 text-white rounded-full p-2 hover:bg-black/60 transition-colors z-20"
          aria-label="Fechar tour"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentIndex ? 'bg-brand-azure scale-125' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-lg font-semibold transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {isLastStep ? (
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg font-semibold transition-colors bg-brand-green1 text-white hover:bg-brand-green2 flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Finalizar
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 rounded-lg font-semibold transition-colors bg-brand-azure text-white hover:opacity-90 flex items-center gap-2"
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