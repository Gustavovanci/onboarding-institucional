// src/components/layout/Sidebar.tsx

import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Home, User, TrendingUp, Clock } from 'lucide-react';
import { INSTITUTOS_CONFIG } from '../../types';

export default function Sidebar() {
  const { user } = useAuthStore();
  const institutConfig = user ? INSTITUTOS_CONFIG[user.instituto] : null;

  const userLevel = Math.floor((user?.points || 0) / 1000) + 1;
  const pointsForCurrentLevel = (user?.points || 0) % 1000;
  const progressToNextLevel = (pointsForCurrentLevel / 1000) * 100;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Ranking', href: '/ranking', icon: TrendingUp },
    { name: 'Meu Perfil', href: '/profile', icon: User },
  ];

  return (
    <div className="flex flex-col w-80 h-full bg-white/90 backdrop-blur-xl border-r border-gray-200/50">
      <div className="flex items-center justify-center h-20 px-6 border-b border-gray-200/50">
        <div className="flex items-center space-x-3">
          <img 
            src={institutConfig?.logo || "/logos-institutos/default.png"} 
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
        <div className="bg-gradient-to-br from-brand-azure/10 to-brand-teal/10 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-700">Seu Nível: {userLevel}</span>
            </div>
            <div className="text-xs bg-brand-azure/10 text-brand-azure px-2 py-1 rounded-full font-medium">
              {user?.points || 0} pts
            </div>
          </div>
          <div className="mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="h-2 rounded-full bg-gradient-to-r from-brand-azure to-brand-teal" style={{ width: `${progressToNextLevel}%` }} />
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
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
              `group relative flex items-center px-4 py-4 text-sm font-medium rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-brand-azure to-brand-teal text-white shadow-lg shadow-blue-500/25 scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:scale-105'
              }`
            }
          >
            <item.icon className="mr-4 w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* ... rodapé da sidebar ... */}
    </div>
  );
};