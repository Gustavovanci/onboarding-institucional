// src/components/dashboard/WelcomeHeader.tsx
import { useAuthStore } from '../../stores/authStore';
import { motion } from 'framer-motion';

// ATENÇÃO: A linha abaixo DEVE ser "export const", não "export default"
export const WelcomeHeader = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
        Bem-vindo(a) de volta, <span className="text-brand-azure">{user.displayName.split(' ')[0]}</span>!
      </h1>
      <p className="mt-2 text-lg text-gray-500">
        {user.profession || 'Continue sua jornada de aprendizado.'}
      </p>
    </motion.div>
  );
};