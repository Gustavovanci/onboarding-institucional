// src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Home, User, TrendingUp, BookOpen, Gift, MessageSquare, Zap, Award, Menu, X, Clock } from 'lucide-react';
import { INSTITUTOS_CONFIG } from '../../types';
import { useState } from 'react';

// Níveis com nomes e ícones
const levelNames = [
  { name: 'Aprendiz HC', icon: '🧑‍🎓' },
  { name: 'Iniciado HC', icon: '📝' },
  { name: 'Explorador HC', icon: '🧭' },
  { name: 'Veterano HC', icon: '🛡️' },
  { name: 'Especialista HC', icon: '⭐' },
  { name: 'Mestre HC', icon: '🏆' },
  { name: 'Guardião HC', icon: '👑' },
];

const navigation = [
  { name: 'Início', href: '/dashboard', icon: Home },
  { name: 'Institucional', href: '/modules', icon: BookOpen },
  { name: 'Certificados', href: '/certificates', icon: Award },
  { name: 'Ranking', href: '/ranking', icon: TrendingUp },
  { name: 'Benefícios', href: '/benefits', icon: Gift },
  { name: 'Comunicação', href: '/communication', icon: MessageSquare },
  { name: 'Inova HC', href: '/innovation', icon: Zap },
  { name: 'Meu Perfil', href: '/profile', icon: User },
];

const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const { user } = useAuthStore();
  const institutConfig = user && user.instituto ? INSTITUTOS_CONFIG[user.instituto] : null;

  const userLevel = Math.floor((user?.points || 0) / 1000);
  const currentLevelInfo = levelNames[Math.min(userLevel, levelNames.length - 1)];

  const pointsForCurrentLevel = (user?.points || 0) % 1000;
  const progressToNextLevel = (pointsForCurrentLevel / 1000) * 100;

  if (!user) { // Skeleton loading
    return (
      <div className="flex flex-col w-64 h-full bg-white/95 border-r border-gray-200/50 animate-pulse">
        <div className="h-20 border-b border-gray-200/50"></div>
        <div className="p-4"><div className="h-32 bg-gray-200 rounded-2xl"></div></div>
        <div className="flex-1 px-4 space-y-2">
          <div className="h-10 bg-gray-200 rounded-xl"></div>
          <div className="h-10 bg-gray-200 rounded-xl"></div>
          <div className="h-10 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-64 h-full bg-white/95 backdrop-blur-xl border-r border-gray-200/50">
      <div className="flex items-center justify-center h-20 px-4 border-b border-gray-200/50">
        <div className="flex items-center space-x-3">
          <img 
            src={institutConfig?.logo || "/hc/ICHC.png"} 
            alt={institutConfig?.fullName || "Logo HC"} 
            className="w-10 h-10 object-contain" 
          />
          <div>
            <span className="text-lg font-bold text-gray-900">Onboarding HC</span>
            <p className="text-xs text-gray-500">Integração Digital</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-4 border border-gray-200/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-800">{currentLevelInfo.icon} {currentLevelInfo.name}</span>
            <div className="text-xs bg-blue-100 text-brand-azure px-2 py-1 rounded-full font-medium">
              {user.points || 0} pts
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 rounded-full bg-gradient-to-r from-brand-azure to-brand-teal" style={{ width: `${progressToNextLevel}%` }} />
          </div>
          <div className="flex items-center space-x-2 text-gray-600 mt-3">
            <Clock className="w-4 h-4" />
            <span className="text-xs">{1000 - pointsForCurrentLevel} pts para o próximo nível</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/dashboard'}
            onClick={onLinkClick} // Fecha o menu no mobile ao clicar
            className={({ isActive }) =>
              `group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-brand-azure text-white shadow-md shadow-blue-500/30'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`
            }
          >
            <item.icon className="mr-3 w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} HCFMUSP
      </div>
    </div>
  );
};

// Componente Wrapper para lidar com a lógica mobile/desktop
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sidebar para Desktop (sempre visível) */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Botão Hamburger para Mobile */}
      <button onClick={() => setIsOpen(true)} className="lg:hidden fixed top-5 left-4 z-50 p-2 bg-white/50 rounded-full backdrop-blur-sm shadow-md">
        <Menu className="h-6 w-6 text-gray-800" />
      </button>

      {/* Sidebar para Mobile (aparece como um menu flutuante) */}
      <AnimatePresence>
        {isOpen && (
          <div className="lg:hidden fixed inset-0 z-[60]">
            {/* Fundo escuro */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)} 
              className="absolute inset-0 bg-black/50"
            />
            {/* Conteúdo do menu */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative h-full"
            >
              <SidebarContent onLinkClick={() => setIsOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}