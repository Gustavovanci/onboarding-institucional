// src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Home, User, TrendingUp, Clock, BookOpen, MessageSquare } from 'lucide-react';
import { INSTITUTOS_CONFIG } from '../../types';

export default function Sidebar() {
  const { user } = useAuthStore();
  const institutConfig = user && user.instituto ? INSTITUTOS_CONFIG[user.instituto] : null;

  const userLevel = Math.floor((user?.points || 0) / 1000) + 1;
  const pointsForCurrentLevel = (user?.points || 0) % 1000;
  const progressToNextLevel = (pointsForCurrentLevel / 1000) * 100;

  const navigation = [
    { name: 'Início', href: '/dashboard', icon: Home },
    { name: 'Módulos', href: '/modules', icon: BookOpen },
    { name: 'Ranking', href: '/ranking', icon: TrendingUp },
    { name: 'Mensagens', href: '/messages', icon: MessageSquare },
    { name: 'Meu Perfil', href: '/profile', icon: User },
  ];

  if (!user) {
    return ( // Renderiza um esqueleto de sidebar enquanto o usuário carrega
      <div className="flex flex-col w-80 h-full bg-white/95 border-r border-gray-200/50 animate-pulse">
        <div className="h-20 border-b border-gray-200/50"></div>
        <div className="p-6"><div className="h-32 bg-gray-200 rounded-2xl"></div></div>
        <div className="flex-1 px-6 space-y-2">
          <div className="h-12 bg-gray-200 rounded-xl"></div>
          <div className="h-12 bg-gray-200 rounded-xl"></div>
          <div className="h-12 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-80 h-full bg-white/95 backdrop-blur-xl border-r border-gray-200/50" id="tour-step-1-sidebar">
      <div className="flex items-center justify-center h-20 px-6 border-b border-gray-200/50">
        <div className="flex items-center space-x-3">
          <img 
            src={institutConfig?.logo || "/hc/ICHC.png"} 
            alt={institutConfig?.fullName || "Logo HC"} 
            className="w-12 h-12 object-contain" 
          />
          <div>
            <span className="text-xl font-bold text-gray-900">Onboarding HC</span>
            <p className="text-xs text-gray-500">Integração Digital</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 border border-gray-200/80">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-800">Seu Nível: {userLevel}</span>
            <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
              {user.points || 0} pts
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="h-2.5 rounded-full bg-gradient-to-r from-brand-azure to-brand-teal" style={{ width: `${progressToNextLevel}%` }} />
          </div>
          <div className="flex items-center space-x-2 text-gray-600 mt-3">
            <Clock className="w-4 h-4" />
            <span className="text-xs">{1000 - pointsForCurrentLevel} pontos para o próximo nível</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/dashboard'}
            className={({ isActive }) =>
              `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-brand-azure text-white shadow-md shadow-blue-500/30'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`
            }
          >
            <item.icon className="mr-4 w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} HCFMUSP
      </div>
    </div>
  );
};