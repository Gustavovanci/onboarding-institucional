// src/components/badges/BadgeDisplay.tsx
import { motion } from 'framer-motion';
import { type Badge, type User } from '../../types';
// ✅ CORREÇÃO: Importa a lista de badges diretamente do store para garantir que esteja sempre atualizada.
import { availableBadges } from '../../stores/progressStore'; 
import { Award } from 'lucide-react';

interface BadgeDisplayProps {
  user: User;
  variant?: 'grid' | 'list' | 'compact';
  maxDisplay?: number;
}

// Função para obter os badges que um usuário ganhou
function getUserEarnedBadges(user: User): Badge[] {
  if (!user || !user.badges) return [];
  // Usa a lista de badges importada e atualizada
  return availableBadges.filter(badge => user.badges.includes(badge.id));
}

const BadgeDisplay = ({
  user,
  variant = 'compact',
  maxDisplay
}: BadgeDisplayProps) => {
  const earnedBadges = getUserEarnedBadges(user);

  if (variant === 'compact') {
    // Ordena para que os badges mais recentes (últimos a serem ganhos) apareçam primeiro
    const badgesToShow = earnedBadges
      .sort((a, b) => user.badges.indexOf(b.id) - user.badges.indexOf(a.id))
      .slice(0, maxDisplay || 4);

    if (badgesToShow.length === 0) {
      return (
        <div className="flex items-center space-x-2 text-gray-500">
          <Award className="w-5 h-5" />
          <span className="text-sm font-medium">Conquiste seu 1º badge!</span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-3" title={`${earnedBadges.length} badge(s) conquistado(s)`}>
        <div className="flex -space-x-3">
          {badgesToShow.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              className="relative w-9 h-9 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-lg shadow-md border-2 border-white"
              title={`${badge.name}: ${badge.description}`}
              style={{ zIndex: badgesToShow.length - index }}
            >
              {badge.icon}
            </motion.div>
          ))}
        </div>
        {earnedBadges.length > (maxDisplay || 4) && (
          <div className="text-sm font-bold text-gray-600">
            +{earnedBadges.length - (maxDisplay || 4)}
          </div>
        )}
      </div>
    );
  }

  // Renderização padrão caso outras variantes sejam implementadas no futuro
  return (
      <div className="p-4 text-center bg-gray-100 rounded-lg">
        <h3 className="font-bold">Visualização de Badges</h3>
        <p className="text-sm text-gray-600">
            {earnedBadges.length > 0 ? `Você tem ${earnedBadges.length} badge(s).` : "Você ainda não tem badges."}
        </p>
      </div>
  );
};

export default BadgeDisplay;