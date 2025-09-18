import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Home, User, Sparkles, TrendingUp, Clock, Trophy } from 'lucide-react'; // Ícone 'Trophy' adicionado

const Sidebar = () => {
  const { user } = useAuthStore();

  const userLevel = Math.floor((user?.points || 0) / 1000) + 1;
  const pointsForCurrentLevel = (user?.points || 0) % 1000;
  const progressToNextLevel = (pointsForCurrentLevel / 1000) * 100;
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Ranking', href: '/ranking', icon: Trophy }, // <-- NOVO LINK ADICIONADO
    { name: 'Meu Perfil', href: '/profile', icon: User },
  ];

  return (
    <div className="flex flex-col w-80 h-full bg-white/90 backdrop-blur-xl border-r border-gray-200/50">
      {/* Header/Logo */}
      <div className="flex items-center justify-center h-20 px-6 border-b border-gray-200/50">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-gradient-primary">
              Onboarding HC
            </span>
            <p className="text-xs text-gray-500">Integração Digital</p>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="p-6">
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-100/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">Seu Nível: {userLevel}</span>
            </div>
            <div className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
              {user?.points || 0} pts
            </div>
          </div>
          <div className="mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="progress-fill"
                style={{ width: `${progressToNextLevel}%` }}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-xs">{1000 - pointsForCurrentLevel} pontos para o próximo nível</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/dashboard'}
            className={({ isActive }) =>
              `group relative flex items-center px-4 py-4 text-sm font-medium rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-lg shadow-blue-500/25 scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:scale-105'
              }`
            }
          >
            <item.icon className="mr-4 w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-6 border-t border-gray-200/50">
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
          <img
            className="w-10 h-10 rounded-xl object-cover border border-gray-200"
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=3B82F6&color=fff&size=128`}
            alt="Avatar"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.displayName}</p>
            <p className="text-xs text-gray-500">{user?.instituto}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;