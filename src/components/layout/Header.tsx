// src/components/layout/Header.tsx - VERSÃO SIMPLIFICADA
import { LogOut, Bell, Settings, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import useNotificationStore from '../../stores/notificationStore';
import { useState, useEffect } from 'react';
import { INSTITUTOS_CONFIG } from '../../types';
import BadgeDisplay from '../badges/BadgeDisplay';

export default function Header() {
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, fetchNotifications, markAsRead } = useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications(user.uid);
    }
  }, [user, fetchNotifications]);

  const getRankingTrend = () => {
    if (!user || !user.previousRank || user.currentRank === 0) return 'same';
    if (user.currentRank < user.previousRank) return 'up';
    if (user.currentRank > user.previousRank) return 'down';
    return 'same';
  };

  const rankingTrend = getRankingTrend();

  const getTrendIcon = () => {
    switch (rankingTrend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  if (!user) return null;

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
         
          {/* Seção esquerda - Badges compactos */}
          <div className="flex items-center space-x-6">
            <BadgeDisplay user={user} variant="compact" maxDisplay={3} />
          </div>

          {/* Seção central - Stats do usuário */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Pontos */}
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-hc-blue to-hc-teal bg-clip-text text-transparent">
                {user.points || 0}
              </div>
              <div className="text-xs text-gray-500 font-medium">Pontos</div>
            </div>

            {/* Ranking com trend */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <span className="text-2xl font-bold text-gray-800">
                  #{user.currentRank || "N/A"}
                </span>
                {getTrendIcon()}
              </div>
              <div className="text-xs text-gray-500 font-medium">Ranking</div>
            </div>

            {/* Módulos completados */}
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {user.completedModules?.length || 0}
              </div>
              <div className="text-xs text-gray-500 font-medium">Módulos</div>
            </div>
          </div>

          {/* Seção direita - Notificações e Settings */}
          <div className="flex items-center space-x-4">
            
            {/* Notificações */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 text-gray-600 hover:text-hc-blue hover:bg-blue-50 rounded-xl transition-all duration-300"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </div>
                )}
              </button>

              {/* Dropdown de notificações */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">Notificações</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAsRead(user.uid)}
                        className="text-sm text-hc-blue hover:text-hc-blue/80"
                      >
                        Marcar todas como lidas
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                            !notification.read ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <p className="font-medium text-sm text-gray-800">{notification.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notification.createdAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Nenhuma notificação</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Settings - removido para simplificar */}
            {/* Mantendo apenas logout na sidebar */}

            {/* Info do usuário - compacta */}
            <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-2">
              <img
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&size=80&background=${INSTITUTOS_CONFIG[user.instituto]?.color.replace('bg-', '').replace('-500', '') || 'blue'}&color=ffffff`}
                alt={user.displayName}
                className="w-10 h-10 rounded-lg object-cover border-2 border-white shadow-sm"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-800 truncate max-w-32">
                  {user.displayName}
                </p>
                <p className="text-xs text-gray-500">
                  {INSTITUTOS_CONFIG[user.instituto]?.name || user.instituto}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clique fora para fechar notificações */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowNotifications(false)}
        />
      )}
    </header>
  );
}