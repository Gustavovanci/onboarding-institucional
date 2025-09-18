import { LogOut, Bell, Settings, User as UserIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import useNotificationStore from '../../stores/notificationStore';
import { useState, useEffect } from 'react';
import { INSTITUTOS_CONFIG } from '../../types';
import { Link } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, fetchNotifications, markAsRead } = useNotificationStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications(user.uid);
    }
  }, [user, fetchNotifications]);

  const institutConfig = user ? INSTITUTOS_CONFIG[user.instituto] : null;
  
  const getRankingTrend = () => {
    if (!user) return null;
    if (user.currentRank < user.previousRank) return 'up';
    if (user.currentRank > user.previousRank) return 'down';
    return 'same';
  };

  const rankingTrend = getRankingTrend();

  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Left Section - Logo Instituto */}
          <div className="flex items-center space-x-4">
            {institutConfig && (
              <div className="flex items-center space-x-3">
                {/* Logo Instituto */}
                <img
                  src={institutConfig.logo || `https://placehold.co/48x48?text=${institutConfig.name.slice(0, 2)}`}
                  alt={institutConfig.fullName}
                  className="w-12 h-12 rounded-2xl"
                />
                <div className="hidden sm:flex flex-col">
                  <h1 className="text-lg font-bold text-gray-900">{institutConfig.name}</h1>
                  <p className="text-xs text-gray-500">{institutConfig.fullName}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Section - Notifications + User Menu */}
          <div className="flex items-center space-x-3">
            
            {/* User Stats Preview */}
            <div className="hidden md:flex items-center space-x-4 bg-gray-50 rounded-xl px-4 py-2">
              <div className="text-center">
                <p className="text-xs text-gray-500">Ranking Geral</p>
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-gray-900">#{user?.currentRank || 0}</span>
                  {rankingTrend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                  {rankingTrend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                  {rankingTrend === 'same' && <Minus className="w-3 h-3 text-gray-400" />}
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Instituto</p>
                <span className="font-bold text-gray-900">#{user?.instituteRank || 0}</span>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Pontos</p>
                <span className="font-bold text-brand-accent">{user?.points || 0}</span>
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 text-gray-500 hover:text-brand-accent hover:bg-brand-accent/10 rounded-xl transition-all duration-200"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200/50 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Notificações</h3>
                    {unreadCount > 0 && (
                      <p className="text-xs text-gray-500">{unreadCount} não lidas</p>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-500">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Nenhuma notificação</p>
                      </div>
                    ) : (
                      notifications.slice(0, 5).map(notification => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? 'bg-blue-50/50' : ''
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-gray-900">
                                {notification.title}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {notification.message}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-brand-accent rounded-full ml-2 mt-1"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-xl transition-colors duration-200"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.displayName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {institutConfig?.name}
                  </p>
                </div>
                <div className="relative">
                  <img
                    className="w-12 h-12 rounded-xl border-2 border-white shadow-md object-cover"
                    src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=3B82F6&color=fff&size=128`}
                    alt="Avatar do usuário"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-primary border-2 border-white rounded-full"></div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 z-50">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <img
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-gray-200"
                        src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=3B82F6&color=fff&size=128`}
                        alt="Avatar"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {user?.displayName}
                        </h3>
                        <p className="text-sm text-gray-600">{user?.profession}</p>
                        <p className="text-sm text-gray-500">{institutConfig?.fullName}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                      <div className="text-center">
                        <div className="text-lg font-bold text-brand-accent">{user?.points || 0}</div>
                        <div className="text-xs text-gray-500">Pontos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-brand-primary">#{user?.currentRank || 0}</div>
                        <div className="text-xs text-gray-500">Ranking</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">{user?.badges?.length || 0}</div>
                        <div className="text-xs text-gray-500">Badges</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <Link to="/profile" className="flex items-center space-x-3 w-full p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                      <UserIcon className="w-5 h-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Ver Perfil</span>
                    </Link>
                    <Link to="/settings" className="flex items-center space-x-3 w-full p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                      <Settings className="w-5 h-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Configurações</span>
                    </Link>
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={logout}
                      className="flex items-center space-x-3 w-full p-3 text-left hover:bg-red-50 rounded-xl transition-colors group"
                    >
                      <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-500" />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">Sair</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {(showUserMenu || showNotifications) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        ></div>
      )}
    </header>
  );
}