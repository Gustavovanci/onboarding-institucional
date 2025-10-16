// src/components/layout/Header.tsx
import { LogOut, Bell, Settings, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import useNotificationStore from '../../stores/notificationStore';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BadgeDisplay from '../badges/BadgeDisplay';

export default function Header() {
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, fetchNotifications } = useNotificationStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications(user.uid);
    }
  }, [user, fetchNotifications]);

  if (!user) return null;

  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex-1">
            <BadgeDisplay user={user} variant="compact" maxDisplay={4} />
          </div>

          <div id="tour-step-4-header-actions" className="flex items-center gap-4">
            
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                title="Notificações"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            <div className="relative">
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-brand-azure hover:ring-offset-2 transition-all">
                <img
                  crossOrigin="anonymous" 
                  referrerPolicy="no-referrer" // <-- CORREÇÃO ADICIONADA
                  src={user.photoURL ? user.photoURL : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}`}
                  alt="Avatar do usuário"
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                />
              </button>
              
              {showUserMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border z-50 overflow-hidden"
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <p className="text-sm font-semibold text-gray-800 truncate">{user.displayName}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <ul className="py-1">
                    <li>
                      <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <UserIcon className="w-4 h-4" /> Meu Perfil
                      </Link>
                    </li>
                    <li>
                      <Link to="/settings" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Settings className="w-4 h-4" /> Configurações
                      </Link>
                    </li>
                    <li>
                      <button 
                        onClick={logout} 
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                      >
                        <LogOut className="w-4 h-4" /> Sair
                      </button>
                    </li>
                  </ul>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}