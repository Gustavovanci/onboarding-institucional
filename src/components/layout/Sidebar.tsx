// src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Home, User, TrendingUp, BookOpen, Gift, MessageSquare, Zap, Award, Menu, X, Clock, Heart, Cloud, Info, ChevronLeft, ChevronRight, Shield, HardHat, HandHeart, Send, Laptop } from 'lucide-react';
import { INSTITUTOS_CONFIG } from '../../types';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LEVELS } from '@/config/gamification';

// NOVA ESTRUTURA DE NAVEGAÇÃO
const navigationTop = [
  { name: 'Início', href: '/dashboard', icon: Home },
  { name: 'Boas Vindas', href: '/boas-vindas', icon: Heart },
  { name: 'Quem somos', href: '/quem-somos', icon: Info },
  { name: 'Institucional', href: '/modules', icon: BookOpen },
  { name: 'Segurança do Trabalho', href: '/seguranca-trabalho', icon: HardHat },
  { name: 'Benefícios', href: '/benefits', icon: Gift },
];

const navigationBottom = [
  { name: 'Inova HC', href: '/innovation', icon: Zap },
  { name: 'Humanização', href: '/humanizacao', icon: HandHeart },
  { name: 'Certificado', href: '/certificates', icon: Award },
  { name: 'Nuvem de ideias', href: '/messages', icon: Cloud },
  { name: 'Ranking', href: '/ranking', icon: TrendingUp },
  { name: 'Comunicação com RH', href: '/comunicacao-rh', icon: Send },
  { name: 'Sistema HCFMUSP', href: '/sistemas-hcfmusp', icon: Laptop },
  { name: 'Meu Perfil', href: '/profile', icon: User },
];

const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin/dashboard', icon: Shield },
];


const calculateLevelInfo = (points: number) => {
  const currentLevel = [...LEVELS].reverse().find(l => points >= l.minPoints) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.minPoints > currentLevel.minPoints);

  if (!nextLevel) {
    return { currentLevel, nextLevel: null, progress: 100, pointsToNextLevel: 0 };
  }

  const pointsInCurrentLevel = points - currentLevel.minPoints;
  const pointsForNextLevel = nextLevel.minPoints - currentLevel.minPoints;
  const progress = (pointsInCurrentLevel / pointsForNextLevel) * 100;
  const pointsToNextLevel = nextLevel.minPoints - points;

  return { currentLevel, nextLevel, progress: Math.min(progress, 100), pointsToNextLevel };
};

const SidebarContent = ({ 
  isCollapsed, 
  onLinkClick, 
  onClose, 
  isMobile 
}: { 
  isCollapsed: boolean; 
  onLinkClick?: () => void; 
  onClose?: () => void;
  isMobile?: boolean;
}) => {
  const { user } = useAuthStore();
  const institutConfig = user && user.instituto ? INSTITUTOS_CONFIG[user.instituto] : null;

  if (!user) return null;

  const { currentLevel, nextLevel, progress, pointsToNextLevel } = calculateLevelInfo(user.points || 0);
  
  // Função auxiliar para renderizar os links
  const renderNavLinks = (items: typeof navigationTop) => {
    return items.map((item) => (
      <NavLink
        key={item.name}
        to={item.href}
        end={['/dashboard', '/boas-vindas', '/quem-somos'].includes(item.href)}
        onClick={onLinkClick}
        title={isCollapsed ? item.name : undefined}
        className={({ isActive }) =>
          `group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${isCollapsed ? 'justify-center' : ''} ${
            isActive ? 'bg-brand-azure text-white shadow-md shadow-blue-500/30' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
    ));
  };


  return (
    <motion.div 
      animate={{ width: isCollapsed ? '5rem' : '16rem' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex flex-col h-full bg-white/95 backdrop-blur-xl border-r border-gray-200/50 overflow-hidden"
    >
      <div className="flex items-center justify-between h-20 px-4 border-b border-gray-200/50 flex-shrink-0">
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

        {isMobile && onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fechar menu"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-4">
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-4 border border-gray-200/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">{currentLevel.icon} {currentLevel.name}</span>
                <div className="text-xs bg-blue-100 text-brand-azure px-2 py-1 rounded-full font-medium">{user.points || 0} pts</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full bg-gradient-to-r from-brand-azure to-brand-green1" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex items-center space-x-2 text-gray-600 mt-3">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs whitespace-nowrap">
                  {nextLevel ? `${pointsToNextLevel} pts para o próximo nível` : 'Nível Máximo!'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navegação CORRIGIDA */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4">
        <div className="space-y-1">
          {renderNavLinks(navigationTop)}
        </div>
        
        {/* Divisor */}
        <div className="py-3">
            <div className={`border-t border-gray-200 ${isCollapsed ? 'mx-2' : 'mx-3'}`}></div>
        </div>

        <div className="space-y-1">
          {renderNavLinks(navigationBottom)}
        </div>

        {user && user.role === 'admin' && (
            <>
                <div className={`px-3 pt-6 pb-2 ${isCollapsed ? 'hidden' : ''}`}>
                    <span className="text-xs font-semibold text-gray-400 uppercase">Admin</span>
                </div>
                {adminNavigation.map((item) => (
                   <NavLink
                   key={item.name}
                   to={item.href}
                   onClick={onLinkClick}
                   title={isCollapsed ? item.name : undefined}
                   className={({ isActive }) =>
                     `group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${isCollapsed ? 'justify-center' : ''} ${
                       isActive ? 'bg-brand-red text-white shadow-md shadow-red-500/30' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
            </>
        )}
      </nav>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 text-center text-xs text-gray-400 flex-shrink-0 border-t border-gray-200/50">
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
        <SidebarContent isCollapsed={isDesktopCollapsed} isMobile={false} />
        <button 
          onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
          className="absolute top-1/2 -right-3 z-10 w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
          title={isDesktopCollapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {isDesktopCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <button 
        onClick={() => setIsMobileOpen(true)} 
        className="lg:hidden fixed top-4 left-4 z-[70] p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 border border-gray-200"
        aria-label="Abrir menu"
      >
        <Menu className="h-6 w-6 text-gray-800" />
      </button>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 z-[80] backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 z-[90] shadow-2xl"
            >
              <SidebarContent 
                isCollapsed={false} 
                onLinkClick={() => setIsMobileOpen(false)}
                onClose={() => setIsMobileOpen(false)}
                isMobile={true}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}