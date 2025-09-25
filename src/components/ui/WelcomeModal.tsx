import { motion, AnimatePresence } from "framer-motion";

type Props = {
  onClose: () => void;
};

export default function WelcomeModal({ onClose }: Props) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40"
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
          className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-[0_10px_30px_rgba(15,23,42,.12)] overflow-hidden"
        >
          {/* Header com gradiente nas cores da marca */}
          <div className="h-28 bg-gradient-to-r from-brand-azure to-brand-teal relative">
            <div className="absolute inset-0 bg-white/0" />
          </div>

          <div className="-mt-14 px-8 pb-8">
            {/* Avatar/ícone */}
            <div className="w-20 h-20 mx-auto rounded-2xl border-4 border-white bg-brand-azure grid place-items-center shadow-md">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" fill="white"/>
              </svg>
            </div>

            <h2 className="mt-4 text-center text-2xl font-extrabold text-brand-azure">
              Bem-vindo(a) ao Onboarding HC
            </h2>
            <p className="mt-2 text-center text-gray-600">
              Complete os módulos obrigatórios, ganhe pontos e desbloqueie conquistas.
              Seu progresso fica salvo automaticamente.
            </p>

            <ul className="mt-6 space-y-2 text-sm text-gray-700">
              <li>• Os módulos aparecem na sua Dashboard, em ordem sugerida.</li>
              <li>• Ao concluir um módulo, você soma pontos e pode ganhar badges.</li>
              <li>• Você pode voltar e revisar conteúdos quando quiser.</li>
            </ul>

            <button onClick={onClose} className="btn-primary w-full mt-8">
              Começar agora
            </button>

            <button
              onClick={onClose}
              className="mt-3 w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Depois eu vejo
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
