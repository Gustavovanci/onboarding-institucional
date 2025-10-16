// src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Home, User, TrendingUp, BookOpen, Gift, MessageSquare, Zap, Award, Menu, X, Clock, Heart, Cloud, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { INSTITUTOS_CONFIG } from '../../types';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// CORREÇÃO: Nova estrutura de níveis com pontuação mínima
const LEVELS = [
  { level: 1, name: 'Aprendiz HC', icon: '🧑‍🎓', minPoints: 0 },
  { level: 2, name: 'Iniciado HC', icon: '📝', minPoints: 150 },
  { level: 3, name: 'Explorador HC', icon: '🧭', minPoints: 250 },
  { level: 4, name: 'Veterano HC', icon: '🛡️', minPoints: 350 },
  { level: 5, name: 'Especialista HC', icon: '⭐', minPoints: 450 },
  { level: 6, name: 'Mestre HC', icon: '🏆', minPoints: 550 },
  { level: 7, name: 'Guardião HC', icon: '👑', minPoints: 650 },
  { level: 8, name: 'Mago HC', icon: '🧙‍♂️', minPoints: 950 },
];

const navigation = [
  { name: 'Início', href: '/dashboard', icon: Home },
  { name: 'Boas-Vindas', href: '/boas-vindas', icon: Heart },
  { name: 'Quem Somos', href: '/quem-somos', icon: Info },
  { name: 'Trilha Institucional', href: '/modules', icon: BookOpen },
  { name: 'Certificados', href: '/certificates', icon: Award },
  { name: 'Ranking', href: '/ranking', icon: TrendingUp },
  { name: 'Nuvem de Ideias', href: '/messages', icon: Cloud },
  { name: 'Benefícios', href: '/benefits', icon: Gift },
  { name: 'Comunicação', href: '/communication', icon: MessageSquare },
  { name: 'Inova HC', href: '/innovation', icon: Zap },
  { name: 'Meu Perfil', href: '/profile', icon: User },
];

// CORREÇÃO: Nova função para calcular o nível e o progresso
const calculateLevelInfo = (points: number) => {
  const currentLevel = [...LEVELS].reverse().find(l => points >= l.minPoints) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.minPoints > currentLevel.minPoints);

  if (!nextLevel) { // Usuário está no nível máximo
    return {
      currentLevel,
      nextLevel: null,
      progress: 100,
      pointsToNextLevel: 0,
    };
  }

  const pointsInCurrentLevel = points - currentLevel.minPoints;
  const pointsForNextLevel = nextLevel.minPoints - currentLevel.minPoints;
  const progress = (pointsInCurrentLevel / pointsForNextLevel) * 100;
  const pointsToNextLevel = nextLevel.minPoints - points;

  return {
    currentLevel,
    nextLevel,
    progress: Math.min(progress, 100), // Garante que a barra não passe de 100%
    pointsToNextLevel,
  };
};


const SidebarContent = ({ isCollapsed, onLinkClick }: { isCollapsed: boolean, onLinkClick?: () => void }) => {
  const { user } = useAuthStore();
  const institutConfig = user && user.instituto ? INSTITUTOS_CONFIG[user.instituto] : null;

  if (!user) return null;

  // CORREÇÃO: Usa a nova função para obter os dados do nível
  const { currentLevel, progress, pointsToNextLevel } = calculateLevelInfo(user.points || 0);

  return (
    <motion.div 
      animate={{ width: isCollapsed ? '5rem' : '16rem' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex flex-col h-full bg-white/95 backdrop-blur-xl border-r border-gray-200/50 overflow-hidden"
    >
      {/* Header da Sidebar */}
      <div className="flex items-center justify-center h-20 px-4 border-b border-gray-200/50 flex-shrink-0">
        <div className={`flex items-center space-x-3 transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}>
          <img
            src={institutConfig?.logo || "/hc/ICHC.png"}
            alt={institutConfig?.fullName || "Logo HC"}
            className="w-10 h-10 object-contain flex-shrink-0"
          />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                <span className="text-lg font-bold text-gray-900 whitespace-nowrap">Onboarding HC</span>
                <p className="text-xs text-gray-500 whitespace-nowrap">Integração Digital</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Card de Nível */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-4">
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-4 border border-gray-200/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">{currentLevel.icon} {currentLevel.name}</span>
                <div className="text-xs bg-blue-100 text-brand-azure px-2 py-1 rounded-full font-medium">
                  {user.points || 0} pts
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full bg-gradient-to-r from-brand-azure to-brand-green1" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex items-center space-x-2 text-gray-600 mt-3">
                <Clock className="w-4 h-4 flex-shrink-0" />
                {/* CORREÇÃO: Exibe a pontuação correta para o próximo nível */}
                <span className="text-xs whitespace-nowrap">
                  {pointsToNextLevel > 0 ? `${pointsToNextLevel} pts para o próximo nível` : 'Nível Máximo!'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navegação */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={['/dashboard', '/boas-vindas', '/quem-somos'].includes(item.href)}
            onClick={onLinkClick}
            title={isCollapsed ? item.name : undefined}
            className={({ isActive }) =>
              `group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${isCollapsed ? 'justify-center' : ''} ${
                isActive
                  ? 'bg-brand-azure text-white shadow-md shadow-blue-500/30'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`
            }
          >
            <item.icon className={`flex-shrink-0 w-5 h-5 ${!isCollapsed ? 'mr-3' : ''}`} />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                  {item.name}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Rodapé da Sidebar */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 text-center text-xs text-gray-400 flex-shrink-0">
            © {new Date().getFullYear()} HCFMUSP
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  return (
    <>
      <div className="hidden lg:flex lg:flex-shrink-0 relative">
        <SidebarContent isCollapsed={isDesktopCollapsed} />
        <button 
          onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
          className="absolute top-1/2 -right-3 z-10 w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100"
          title={isDesktopCollapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {isDesktopCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <button onClick={() => setIsMobileOpen(true)} className="lg:hidden fixed top-5 left-4 z-50 p-2 bg-white/50 rounded-full backdrop-blur-sm shadow-md">
        <Menu className="h-6 w-6 text-gray-800" />
      </button>

      <AnimatePresence>
        {isMobileOpen && (
          <div className="lg:hidden fixed inset-0 z-[60]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative h-full w-64"
            >
              <SidebarContent isCollapsed={false} onLinkClick={() => setIsMobileOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}