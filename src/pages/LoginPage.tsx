// src/pages/LoginPage.tsx
import { LogIn, Shield, ArrowDown, BookOpen, Award, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Variantes de animação para os textos e cards
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const LoginPage = () => {
  const { loginWithGoogle, isLoading } = useAuthStore();

  return (
    <div className="w-full bg-gray-50 text-brand-dark">
      {/* Seção Hero */}
      <section 
        className="min-h-screen flex flex-col items-center justify-center text-center p-6 relative overflow-hidden"
      >
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(135deg, #FF4D3D 0%, #FF4D3D 33%, #4CA8E8 33%, #4CA8E8 66%, #2D9B6C 66%, #2D9B6C 100%)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30"></div>
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-10 max-w-4xl flex flex-col items-center"
        >
          <motion.img 
            variants={itemVariants}
           
            className="w-40 md:w-48 mb-6 drop-shadow-2xl"
          />
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-extrabold leading-tight text-white"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            Bem-vindos ao Maior Complexo Hospitalar da América Latina 
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
            style={{ textShadow: '0 1px 5px rgba(0,0,0,0.5)' }}
          >
          </motion.p>
        </motion.div>

        <motion.a 
          href="#features-section"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 flex flex-col items-center text-white/80 z-10 cursor-pointer"
        >
          <span className="mb-2 font-semibold">Role para saber mais</span>
          <ArrowDown className="w-6 h-6" />
        </motion.a>
      </section>

      {/* Seção de Funcionalidades */}
      <section id="features-section" className="py-20 px-6 bg-white">
        <motion.div 
          className="max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-800 mb-12">
            Uma Plataforma Completa para sua Integração
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="text-center p-6 border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF4D3D] to-[#FF6B5D] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"><BookOpen size={32} /></div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Trilhas de Aprendizagem</h3>
              <p className="text-gray-600">Explore módulos essenciais sobre nossa cultura, procedimentos e valores de forma guiada e interativa.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="text-center p-6 border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-[#4CA8E8] to-[#3B8FD1] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"><Award size={32} /></div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Gamificação e Reconhecimento</h3>
              <p className="text-gray-600">Ganhe pontos, conquiste badges e acompanhe seu progresso nos rankings do seu instituto e geral.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="text-center p-6 border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2D9B6C] to-[#1F7A52] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"><TrendingUp size={32} /></div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Conecte-se com o HC</h3>
              <p className="text-gray-600">Conheça a história do maior complexo hospitalar da América Latina e seu papel fundamental no SUS.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>
      
      {/* Seção de Login */}
      <section id="login-section" className="py-20 px-6 bg-gray-100">
        <motion.div 
          className="max-w-md mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={containerVariants}
        >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-800 mb-4">Pronto para começar?</motion.h2>
            <motion.p variants={itemVariants} className="text-gray-600 mb-8">
                Clique no botão abaixo para fazer o login com seu e-mail institucional e dar o primeiro passo na sua jornada.
            </motion.p>
            <motion.button
                variants={itemVariants}
                onClick={loginWithGoogle}
                disabled={isLoading}
                className="bg-gradient-to-r from-[#FF4D3D] to-[#FF6B5D] hover:from-[#FF3D2D] hover:to-[#FF5B4D] text-white font-bold rounded-2xl text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 p-5 px-10 flex items-center justify-center space-x-3 disabled:opacity-70 w-full"
            >
                {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                ) : (
                <>
                    <LogIn className="w-6 h-6" />
                    <span>Entrar com e-mail institucional</span>
                </>
                )}
            </motion.button>
        </motion.div>
      </section>

      {/* Rodapé com o link de Admin */}
      <footer className="bg-gradient-to-r from-[#2D9B6C] to-[#1F7A52] text-white/80 p-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
            <div>
                <p className="text-sm">© {new Date().getFullYear()} Hospital das Clínicas da FMUSP. Todos os direitos reservados.</p>
            </div>
            <div>
                <Link to="/admin/login" className="text-xs text-white/60 hover:text-white hover:underline transition-colors">
                    Acesso Administrativo
                </Link>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;