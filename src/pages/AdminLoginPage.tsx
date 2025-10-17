import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, LogIn } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import '../admin-dashboard.css';

const AdminLoginPage = () => {
  const { loginWithGoogle, user, isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('admin-dashboard-body');
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
    return () => {
      document.body.classList.remove('admin-dashboard-body');
    };
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md text-center p-8 md:p-12"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-black text-white">Acesso Restrito</h1>
        <p className="text-white/70 mt-2 mb-8">Painel de Gestão do Onboarding</p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loginWithGoogle}
          disabled={isLoading}
          className="w-full p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity duration-300 flex items-center justify-center gap-3 text-lg"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <LogIn size={20} />
              <span>Entrar com E-mail Institucional</span>
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;