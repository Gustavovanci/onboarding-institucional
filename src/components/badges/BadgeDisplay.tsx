// src/components/badges/BadgeDisplay.tsx

import { motion } from 'framer-motion';
import { type Badge, type User } from '../../types'; // Certifique-se que o caminho para seus tipos está correto
import { useProgressStore, availableBadges } from '../../stores/progressStore';
import { Lock, Award } from 'lucide-react';

interface BadgeDisplayProps {
  user: User;
  showOnlyEarned?: boolean;
  variant?: 'grid' | 'list' | 'compact';
  maxDisplay?: number;
}

// Função para obter os badges que um usuário ganhou
function getUserEarnedBadges(user: User): Badge[] {
  if (!user || !user.badges) return [];
  return availableBadges.filter(badge => user.badges.includes(badge.id));
}

const BadgeDisplay = ({
  user,
  showOnlyEarned = false,
  variant = 'grid',
  maxDisplay
}: BadgeDisplayProps) => {
  const earnedBadges = getUserEarnedBadges(user);

  // Renderização compacta (para o Header)
  if (variant === 'compact') {
    const badgesToShow = earnedBadges.slice(0, maxDisplay || 4);

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
        <div className="flex -space-x-2">
          {badgesToShow.map((badge, index) => (
            <div
              key={badge.id}
              className="relative w-9 h-9 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-lg shadow-md border-2 border-white"
              title={`${badge.name}: ${badge.description}`}
              style={{ zIndex: badgesToShow.length - index }}
            >
              {badge.icon}
            </div>
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

  // --- Outras variantes (grid, list) podem ser adicionadas aqui no futuro ---
  // Por enquanto, a variante 'compact' é a única necessária para o Header.

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