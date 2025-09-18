// src/components/layout/Header.tsx
import { LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-16">
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-brand-dark">{user?.displayName}</p>
                <p className="text-xs text-gray-500 truncate max-w-[200px]">{user?.email}</p>
              </div>
              <img
                className="h-10 w-10 rounded-full"
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=3487C3&color=fff`}
                alt="Avatar do usuário"
              />
            </div>
            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-2 text-gray-500 hover:text-brand-accent rounded-full hover:bg-red-50 transition-colors"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
