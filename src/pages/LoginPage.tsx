// src/pages/LoginPage.tsx
import { LogIn, Shield, ArrowDown } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const { loginWithGoogle, isLoading } = useAuthStore();

  return (
    <div className="min-h-screen w-full bg-brand-light">
      {/* Seção Hero */}
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 relative overflow-hidden" 
           style={{
             backgroundImage: "url('/fundo_backdropv2.png')", 
             backgroundSize: 'cover', 
             backgroundPosition: 'center'
            }}>
        
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D4E48] via-[#136D5E] to-[#2B97D4] opacity-80"></div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl"
        >
          <img src="/hc/HCFMUSP.png" alt="HCFMUSP Logo" className="w-32 md:w-48 mx-auto mb-8"/>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white">
            Onboarding HCFMUSP
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Integração digital com gamificação, trilhas de conteúdo e uma jornada que começa pela nossa história.
          </p>
        </motion.div>

        <motion.a 
          href="#login-section"
          className="absolute bottom-12 flex flex-col items-center text-white/80 hover:text-white transition-colors z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="mb-2 font-semibold">Role para Logar</span>
          <ArrowDown className="w-8 h-8" />
        </motion.a>
      </div>

      {/* Seção de Login */}
      <div id="login-section" className="flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200/60">
            <div className="text-center mb-8">
                <img src="/hc/Onboarding-HC-Logo.png" alt="Onboarding HC Logo" className="w-40 mx-auto"/>
            </div>
            <button
              onClick={loginWithGoogle}
              disabled={isLoading}
              className="group w-full bg-brand-azure hover:bg-brand-teal text-white font-bold rounded-2xl text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 p-6 flex items-center justify-center space-x-3 disabled:opacity-70"
            >
              {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-6 h-6" />
                  <span>Entrar com e-mail HC</span>
                </>
              )}
            </button>
            <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-200/80">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-brand-azure" />
                <div>
                  <p className="text-gray-800 text-sm font-medium mb-1">Acesso Seguro</p>
                  <p className="text-gray-600 text-xs">
                    Use seu e-mail corporativo para continuar. O acesso é restrito a colaboradores do HC.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Hospital das Clínicas - Integração Digital
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;