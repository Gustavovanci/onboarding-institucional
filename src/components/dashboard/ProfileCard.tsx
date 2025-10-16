// src/components/dashboard/ProfileCard.tsx
import { motion } from "framer-motion";
import type { User, InstitutoConfig } from "../../types";
import { COLOR_THEMES, STATUS_EMOJIS, CUSTOM_TITLES } from "../../config/personalization";

interface ProfileCardProps {
  user: User;
  institutConfig: InstitutoConfig | null;
  completedModulesCount: number;
  totalModules: number;
}

const findById = (array: any[], id: string, defaultId: string) =>
  array.find(item => item.id === id) || array.find(item => item.id === defaultId);

export default function ProfileCard({
  user,
  institutConfig,
  completedModulesCount,
  totalModules,
}: ProfileCardProps) {
  
  const theme = findById(COLOR_THEMES, user.personalizations?.colorTheme || '', 'classic');
  const emoji = findById(STATUS_EMOJIS, user.personalizations?.statusEmoji || '', 'happy');
  const title = findById(CUSTOM_TITLES, user.personalizations?.customTitle || '', 'explorer');

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-card overflow-hidden border border-gray-200/50"
    >
      <div className={`h-48 bg-gradient-to-r ${theme.primary} relative`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-4 left-6 flex items-end gap-6">
          <div className="relative">
            <img
              crossOrigin="anonymous"
              referrerPolicy="no-referrer" // <-- CORREÇÃO ADICIONADA
              src={user.photoURL ? user.photoURL : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&size=160&background=ffffff&color=2b97d4`}
              alt={user.displayName}
              className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg object-cover"
            />
            <div className="absolute -bottom-2 -right-2 w-12 h-12 flex items-center justify-center text-3xl">
              {emoji.emoji}
            </div>
          </div>
          <div className="pb-4 text-white">
            <div className="flex items-center gap-2 mb-1 drop-shadow">
              <span className="text-xl">{title.icon}</span>
              <span className="font-semibold opacity-90">{title.title}</span>
            </div>
            <h1 className="text-3xl font-bold drop-shadow">{user.displayName}</h1>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        {user.bio && (
          <div className="pb-4 mb-4 border-b border-gray-200">
            <p className="text-center text-gray-600 italic">"{user.bio}"</p>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center"><div className="text-2xl font-bold text-brand-azure">{user.points || 0}</div><div className="text-xs text-gray-500">Pontos</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-brand-teal">#{user.currentRank || "N/A"}</div><div className="text-xs text-gray-500">Ranking Geral</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-purple-600">#{user.instituteRank || "N/A"}</div><div className="text-xs text-gray-500">No Instituto</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-yellow-600">{user.badges?.length || 0}</div><div className="text-xs text-gray-500">Badges</div></div>
          <div className="text-center"><div className="text-2xl font-bold text-brand-red">{completedModulesCount}/{totalModules}</div><div className="text-xs text-gray-500">Módulos</div></div>
        </div>
      </div>
    </motion.div>
  );
}