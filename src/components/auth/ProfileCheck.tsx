import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProfileCheck = () => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Se o usuário está logado, mas o perfil não está completo,
  // redireciona para a página de configuração.
  if (user && !user.profileCompleted) {
    return <Navigate to="/profile-setup" replace />;
  }

  // Se o perfil estiver completo, permite o acesso às rotas filhas
  return <Outlet />;
};

export default ProfileCheck;