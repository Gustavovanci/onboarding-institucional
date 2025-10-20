// src/components/layout/Header.tsx
import { LogOut, Bell, Settings, User as UserIcon, X, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import useNotificationStore from '../../stores/notificationStore';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BadgeDisplay from '../badges/BadgeDisplay';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
export default function Header() {
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, fetchNotifications, markAllAsRead, deleteNotification } = useNotificationStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      fetchNotifications(user.uid);
    }
  }, [user?.uid, fetchNotifications]);

  if (!user) return null;
  
  // Limpa URLs longas do Google que causam CORS
  const cleanPhotoURL = (url: string | null | undefined) => {
    if (!url) return null;
    return url.split('=')[0];
  };

  const userPhotoURL = cleanPhotoURL(user.photoURL) || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=random`;
  
  const handleBellClick = () => {
    setShowNotifications(prev => {
      const nextState = !prev;
      if (nextState && unreadCount > 0) {
        markAllAsRead(user.uid);
      }
      return nextState;
    });
  };

  const handleDeleteNotification = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    deleteNotification(notificationId);
  };

  return (
    <>
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            
            <div className="flex-1 overflow-x-auto">
              <BadgeDisplay user={user} variant="compact" maxDisplay={4} />
            </div>

            <div id="tour-step-4-header-actions" className="flex items-center gap-2 sm:gap-4">
              
              {/* Botão de Notificações */}
              <button 
                onClick={handleBellClick}
                className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                title="Notificações"
              >
                <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Menu do Usuário */}
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)} 
                  className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-brand-azure hover:ring-offset-2 transition-all"
                >
                  <img
                    src={userPhotoURL}
                    alt={user.displayName}
                    className="w-9 h-9 sm:w-10 sm:h-10 border-2 border-white shadow-sm rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=random`;
                    }}
                    referrerPolicy="no-referrer"
                  />
                </button>
                
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border z-50 overflow-hidden"
                      onMouseLeave={() => setShowUserMenu(false)}
                    >
                      <div className="px-4 py-3 border-b bg-gray-50">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user.displayName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <ul className="py-1">
                        <li>
                          <Link 
                            to="/profile" 
                            onClick={() => setShowUserMenu(false)} 
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <UserIcon className="w-4 h-4" /> Meu Perfil
                          </Link>
                        </li>
                        <li>
                          <Link 
                            to="/settings" 
                            onClick={() => setShowUserMenu(false)} 
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <Settings className="w-4 h-4" /> Configurações
                          </Link>
                        </li>
                        <li>
                          <button 
                            onClick={logout} 
                            className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> Sair
                          </button>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Painel de Notificações - Desktop: Dropdown | Mobile: Fullscreen */}
      <AnimatePresence>
        {showNotifications && (
          <>
            {/* Overlay para fechar ao clicar fora (apenas mobile) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] md:hidden"
            />

            {/* Painel de Notificações */}
            <motion.div
              initial={{ 
                opacity: 0, 
                y: window.innerWidth < 768 ? '100%' : -10,
                scale: window.innerWidth < 768 ? 1 : 0.95 
              }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: 1 
              }}
              exit={{ 
                opacity: 0, 
                y: window.innerWidth < 768 ? '100%' : -10,
                scale: window.innerWidth < 768 ? 1 : 0.95 
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed md:absolute right-0 md:right-4 lg:right-8 top-0 md:top-20 
                         w-full md:w-96 h-full md:h-auto md:max-h-[32rem]
                         bg-white md:rounded-lg shadow-2xl border-0 md:border z-[70]
                         flex flex-col"
            >
              {/* Header do Painel */}
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-brand-azure to-blue-600 md:bg-none md:from-transparent md:to-transparent">
                <h3 className="font-bold text-white md:text-gray-800 text-lg">
                  Notificações
                  {unreadCount > 0 && (
                    <span className="ml-2 text-xs bg-white md:bg-red-500 text-brand-azure md:text-white px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </h3>
                <button 
                  onClick={() => setShowNotifications(false)} 
                  className="p-1.5 rounded-full text-white md:text-gray-400 hover:bg-white/20 md:hover:bg-gray-100 md:hover:text-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lista de Notificações */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-4 flex items-start gap-3 hover:bg-gray-50 active:bg-gray-100 transition-colors ${
                          !notification.read ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        {/* Indicador de não lida */}
                        {!notification.read && (
                          <div className="w-2 h-2 mt-2 rounded-full bg-brand-azure flex-shrink-0" />
                        )}

                        {/* Conteúdo da Notificação */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 leading-relaxed break-words">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1.5">
                            {formatDistanceToNow(new Date(notification.createdAt), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </p>
                        </div>

                        {/* Botão Deletar */}
                        <button
                          onClick={(e) => handleDeleteNotification(e, notification.id)}
                          className="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
                          title="Remover notificação"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Bell className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">Nenhuma notificação</p>
                    <p className="text-sm text-gray-400 mt-1">Você está em dia!</p>
                  </div>
                )}
              </div>

              {/* Footer (opcional - apenas se houver notificações) */}
              {notifications.length > 0 && (
                <div className="border-t p-3 bg-gray-50">
                  <button
                    onClick={() => {
                      // Aqui você pode adicionar lógica para "ver todas"
                      setShowNotifications(false);
                    }}
                    className="w-full text-sm text-brand-azure hover:text-blue-700 font-medium transition-colors"
                  >
                    Ver histórico completo
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}