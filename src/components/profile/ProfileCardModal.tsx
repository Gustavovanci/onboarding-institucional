// src/components/profile/ProfileCardModal.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { type User } from '@/types';
import { COLOR_THEMES, STATUS_EMOJIS, CUSTOM_TITLES } from "@/config/personalization";
import { X } from 'lucide-react';

interface ProfileCardModalProps {
  user: User;
  onClose: () => void;
}

const findById = (array: any[], id: string | undefined, defaultId: string) =>
  array.find(item => item.id === id) || array.find(item => item.id === defaultId);

// ✅ REINSERIR cleanPhotoURL exatamente como na RankingPage
const cleanPhotoURL = (url: string | null | undefined): string | null => {
  if (!url) return null;
  // Só modifica se tiver '='
  if (url.includes('=')) {
      return url.split('=')[0];
  }
  // Se não tiver '=', retorna original
  return url;
};

export default function ProfileCardModal({ user, onClose }: ProfileCardModalProps) {
  const theme = findById(COLOR_THEMES, user.personalizations?.colorTheme, 'classic');
  const emoji = findById(STATUS_EMOJIS, user.personalizations?.statusEmoji, 'happy');
  const title = findById(CUSTOM_TITLES, user.personalizations?.customTitle, 'explorer');

  // Fallback URL usando proxy em dev
  const baseAvatarUrl = 'https://ui-avatars.com/api/';
  const avatarParams = `?name=${encodeURIComponent(user.displayName)}&size=128&background=ffffff&color=2b97d4`; // Tamanho 128 para modal
  const fallbackURL = import.meta.env.DEV
    ? `/avatar-proxy/${avatarParams}` // Caminho do proxy
    : `${baseAvatarUrl}${avatarParams}`; // URL Direta

  // ✅ Aplicar a cleanPhotoURL LOCAL
  const userPhotoURL = cleanPhotoURL(user.photoURL);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          role="dialog"
          aria-modal="true"
          className="relative z-10 w-full max-w-sm"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200/50">
            {/* Header com Tema */}
            <div className={`h-32 bg-gradient-to-r ${theme.primary} relative`}>
              <div className="absolute inset-0 bg-black/10" />
              {/* Botão Fechar */}
              <div className="absolute top-4 right-4">
                <button onClick={onClose} className="bg-black/20 text-white p-1.5 rounded-full hover:bg-black/40 transition-colors">
                  <X size={18} />
                </button>
              </div>
              {/* Container do Avatar */}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <div className="relative">
                  <img
                    crossOrigin="anonymous"
                    // ✅ Usar a URL limpa localmente ou o fallback
                    src={userPhotoURL || fallbackURL}
                    alt={user.displayName}
                    className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover"
                    referrerPolicy="no-referrer" // Manter
                    onError={(e) => {
                      // Garantir que o fallback funcione
                      if (e.currentTarget.src !== fallbackURL) {
                         e.currentTarget.src = fallbackURL;
                      }
                    }}
                  />
                  {/* Emoji de Status */}
                  <div className="absolute -bottom-2 -right-2 text-3xl">
                    {emoji.emoji}
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo do Card */}
            <div className="pt-16 pb-6 px-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900">{user.displayName}</h1>
              {/* Título Personalizado */}
              <div className="flex items-center justify-center gap-2 mt-1 text-gray-500">
                <span>{title.icon}</span>
                <span className="font-semibold">{title.title}</span>
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="text-sm text-gray-600 italic mt-4">"{user.bio}"</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}