// src/components/badges/BadgeDisplay.tsx - VERSÃO CORRIGIDA
import { motion } from 'framer-motion';
import { Badge, User } from '../../types';
import { useProgressStore, availableBadges } from '../../stores/progressStore';
import { Lock, Award, Clock, Target } from 'lucide-react';

interface BadgeDisplayProps {
  user: User;
  showOnlyEarned?: boolean;
  variant?: 'grid' | 'list' | 'compact';
  maxDisplay?: number;
}

// Função auxiliar para gerar texto dos requisitos
function getRequirementText(badge: Badge, user: User): string {
  if (badge.requirements.modulesCompleted) {
    const current = user.completedModules.length;
    const required = badge.requirements.modulesCompleted;
    return `${current}/${required} módulos`;
  }
  
  if (badge.requirements.pointsEarned) {
    const current = user.points || 0;
    const required = badge.requirements.pointsEarned;
    return `${current}/${required} pontos`;
  }
  
  if (badge.requirements.profileCompleted) {
    return user.profileCompleted ? 'Perfil completo!' : 'Complete seu perfil';
  }
  
  return 'Requisitos especiais';
}

// Função para calcular progresso do badge
function getBadgeProgress(badge: Badge, user: User): number {
  if (badge.requirements.modulesCompleted) {
    return Math.min(
      (user.completedModules.length / badge.requirements.modulesCompleted) * 100,
      100
    );
  }
  if (badge.requirements.pointsEarned) {
    return Math.min(
      ((user.points || 0) / badge.requirements.pointsEarned) * 100,
      100
    );
  }
  if (badge.requirements.profileCompleted) {
    return user.profileCompleted ? 100 : 0;
  }
  return 0;
}

const BadgeDisplay = ({ 
  user, 
  showOnlyEarned = false, 
  variant = 'grid',
  maxDisplay 
}: BadgeDisplayProps) => {
  const { getBadgeById, getUserBadges } = useProgressStore();
  
  // Obter badges do usuário
  const userBadges = getUserBadges(user);
  
  // Obter todos os badges disponíveis com status
  const badgesToShow = availableBadges.map(badge => ({
    ...badge,
    earned: user.badges.includes(badge.id),
    progress: getBadgeProgress(badge, user)
  }));

  // Filtrar badges conforme necessário
  const filteredBadges = showOnlyEarned 
    ? badgesToShow.filter(badge => badge.earned)
    : badgesToShow;

  // Limitar quantidade se especificado
  const displayBadges = maxDisplay 
    ? filteredBadges.slice(0, maxDisplay)
    : filteredBadges;

  // Renderização compacta para sidebar/header
  if (variant === 'compact') {
    const earnedBadges = userBadges.slice(0, maxDisplay || 5);
    
    if (earnedBadges.length === 0) {
      return (
        <div className="flex items-center space-x-2 text-gray-500">
          <Award className="w-5 h-5" />
          <span className="text-sm">Nenhum badge ainda</span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <div className="flex -space-x-1">
          {earnedBadges.map((badge, index) => (
            <div
              key={badge.id}
              className="relative w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-sm shadow-lg border-2 border-white"
              title={`${badge.name} - ${badge.description}`}
              style={{ zIndex: earnedBadges.length - index }}
            >
              {badge.icon}
            </div>
          ))}
        </div>
        {userBadges.length > (maxDisplay || 5) && (
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 border-2 border-white shadow">
            +{userBadges.length - (maxDisplay || 5)}
          </div>
        )}
        <span className="text-sm font-medium text-gray-700">
          {userBadges.length} badge{userBadges.length !== 1 ? 's' : ''}
        </span>
      </div>
    );
  }

  // Renderização em lista
  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {displayBadges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-300 ${
              badge.earned
                ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-sm'
                : 'bg-gray-50 border-gray-200 opacity-60'
            }`}
          >
            <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
              badge.earned 
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg'
                : 'bg-gray-300'
            }`}>
              {badge.earned ? badge.icon : <Lock className="w-6 h-6 text-gray-600" />}
              
              {badge.earned && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className={`font-bold ${badge.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                  {badge.name}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Award className="w-4 h-4" />
                  <span>{badge.points} pts</span>
                </div>
              </div>
              <p className={`text-sm ${badge.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                {badge.description}
              </p>
              
              {/* Barra de progresso para badges não conquistados */}
              {!badge.earned && badge.progress > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Progresso</span>
                    <span className="text-xs text-gray-500">{Math.round(badge.progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-hc-blue to-hc-teal h-2 rounded-full transition-all duration-500"
                      style={{ width: `${badge.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Renderização em grid (padrão)
  return (
    <div className={`grid gap-4 ${
      variant === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'
    }`}>
      {displayBadges.map((badge, index) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: badge.earned ? 1.05 : 1.02 }}
          className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
            badge.earned
              ? 'bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 border-yellow-200 shadow-lg hover:shadow-xl'
              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
          }`}
          title={badge.description}
        >
          {/* Badge icon */}
          <div className={`relative w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 ${
            badge.earned 
              ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 shadow-lg' 
              : 'bg-gray-300'
          }`}>
            {badge.earned ? (
              badge.icon
            ) : (
              <Lock className="w-8 h-8 text-gray-600" />
            )}
            
            {/* Checkmark for earned badges */}
            {badge.earned && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md"
              >
                <span className="text-white text-sm font-bold">✓</span>
              </motion.div>
            )}

            {/* Progress indicator for unearned badges */}
            {!badge.earned && badge.progress > 0 && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-hc-blue to-hc-teal transition-all duration-500"
                  style={{ width: `${badge.progress}%` }}
                />
              </div>
            )}
          </div>

          {/* Badge info */}
          <div className="text-center">
            <h3 className={`font-bold mb-1 ${badge.earned ? 'text-gray-900' : 'text-gray-500'}`}>
              {badge.name}
            </h3>
            <p className={`text-xs mb-3 ${badge.earned ? 'text-gray-600' : 'text-gray-400'}`}>
              {badge.description}
            </p>
            
            {/* Points display */}
            <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${
              badge.earned 
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-200 text-gray-600'
            }`}>
              <Award className="w-3 h-3" />
              <span>{badge.points} pts</span>
            </div>

            {/* Progress percentage for unearned badges */}
            {!badge.earned && badge.progress > 0 && (
              <div className="mt-2 text-xs text-gray-500 flex items-center justify-center space-x-1">
                <Target className="w-3 h-3" />
                <span>{Math.round(badge.progress)}%</span>
              </div>
            )}

            {/* Requirements hint */}
            {!badge.earned && (
              <div className="mt-2 text-xs text-gray-400">
                {getRequirementText(badge, user)}
              </div>
            )}
          </div>
        </motion.div>
      ))}
      
      {/* Empty state */}
      {displayBadges.length === 0 && (
        <div className="col-span-full text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {showOnlyEarned ? 'Nenhum badge conquistado ainda' : 'Nenhum badge disponível'}
          </h3>
          <p className="text-gray-400">
            {showOnlyEarned 
              ? 'Complete módulos e atividades para conquistar seus primeiros badges!'
              : 'Continue explorando para descobrir novos desafios!'
            }
          </p>
        </div>
      )}
    </div>
  );
};

// EXPORT DEFAULT CORRETO
export default BadgeDisplay;