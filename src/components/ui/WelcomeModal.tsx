// src/components/ui/WelcomeModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { Compass } from "lucide-react"; // Removemos o Sparkles

type Props = {
  onClose: () => void;
  onStartTour: () => void;
};

export default function WelcomeModal({ onClose, onStartTour }: Props) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          role="dialog"
          aria-modal="true"
          className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Nova Seção para a Imagem - Mais rasa, sem gradiente */}
          <div className="h-24 relative flex items-center justify-center p-4"> {/* Altura ajustada */}
            {/* A imagem do logo pode ser adicionada aqui. Exemplo: */}
            <img 
              src="/hc/Onboarding-HC-Logo.png" // Caminho para a sua imagem
              alt="Logo Onboarding HC" 
              className="max-h-full max-w-full object-contain" // Garante que a imagem se ajuste
            />
          </div>

          <div className="px-8 pb-8 text-center"> {/* Removido o -mt-14 */}
            {/* O círculo do logo que você tinha antes, se quiser manter. Se não, remova. */}
            {/* <div className="w-20 h-20 mx-auto rounded-full border-4 border-white bg-brand-azure grid place-items-center shadow-lg">
                <img src="/hc/ICHC.png" alt="Logo HC" className="p-3"/>
            </div> */}

            <h2 className="mt-4 text-2xl font-extrabold text-brand-dark">
              Bem-vindo(a) ao Onboarding HC!
            </h2>
            <p className="mt-2 text-gray-600">
              Sua jornada de integração começa agora. Complete os módulos, ganhe pontos e explore o universo do Hospital das Clínicas.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={onStartTour} className="btn-secondary w-full inline-flex items-center justify-center gap-2">
                <Compass className="w-5 h-5"/>
                Fazer Tour Guiado
              </button>
              <button onClick={onClose} className="btn-primary w-full">
                Começar Agora
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}