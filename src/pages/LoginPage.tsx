// src/pages/LoginPage.tsx
import { LogIn, Shield, ArrowDown, BookOpen, Award, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { motion } from 'framer-motion';

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
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/fundo_backdropv2.png')" }}
        >
          {/* Overlay para escurecer um pouco e melhorar o contraste */}
          <div className="absolute inset-0 bg-brand-green3/70"></div>
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-10 max-w-4xl flex flex-col items-center"
        >
          <motion.img 
            variants={itemVariants}
            src="/hc/HCFMUSP.png" 
            alt="HCFMUSP Logo" 
            className="w-40 md:w-48 mb-6 brightness-0 invert"
          />
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-extrabold leading-tight text-white"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            Sua Jornada no HCFMUSP Começa Aqui
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
            style={{ textShadow: '0 1px 5px rgba(0,0,0,0.5)' }}
          >
            Bem-vindo(a) à plataforma de Onboarding Digital. Um espaço interativo para integrar, aprender e crescer conosco desde o primeiro dia.
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
          <h2 className="text-center text-3xl md:text-4xl font-bold text-brand-green3 mb-12">
            Uma Plataforma Completa para sua Integração
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <motion.div variants={itemVariants} className="text-center p-6 border border-gray-200 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-brand-azure text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen size={32} />
              </div>
              <h3 className="text-xl font-bold text-brand-green3 mb-2">Trilhas de Aprendizagem</h3>
              <p>Explore módulos essenciais sobre nossa cultura, procedimentos e valores de forma guiada e interativa.</p>
            </motion.div>
            {/* Card 2 */}
            <motion.div variants={itemVariants} className="text-center p-6 border border-gray-200 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-brand-green1 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-bold text-brand-green3 mb-2">Gamificação e Reconhecimento</h3>
              <p>Ganhe pontos, conquiste badges e acompanhe seu progresso nos rankings do seu instituto e geral.</p>
            </motion.div>
            {/* Card 3 */}
            <motion.div variants={itemVariants} className="text-center p-6 border border-gray-200 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-brand-red text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-xl font-bold text-brand-green3 mb-2">Conecte-se com o HC</h3>
              <p>Conheça a história do maior complexo hospitalar da América Latina e seu papel fundamental no SUS.</p>
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
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-brand-green3 mb-4">Pronto para começar?</motion.h2>
            <motion.p variants={itemVariants} className="text-gray-600 mb-8">
                Clique no botão abaixo para fazer o login com seu e-mail institucional e dar o primeiro passo na sua jornada.
            </motion.p>
            <motion.button
                variants={itemVariants}
                onClick={loginWithGoogle}
                disabled={isLoading}
                className="bg-brand-red hover:opacity-90 text-white font-bold rounded-2xl text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 p-5 px-10 flex items-center justify-center space-x-3 disabled:opacity-70 w-full"
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

      {/* Rodapé */}
      <footer className="bg-brand-green3 text-white/80 p-10">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <h4 className="text-lg font-bold text-white mb-2">Onboarding Digital HCFMUSP</h4>
            <p className="text-sm">© {new Date().getFullYear()} Hospital das Clínicas da FMUSP. Todos os direitos reservados.</p>
            <div className="mt-4 p-4 bg-white/10 rounded-lg flex items-center space-x-3">
              <Shield className="w-5 h-5 text-white" />
              <div>
                <p className="text-white text-sm font-medium">Acesso Seguro</p>
                <p className="text-white/80 text-xs">
                  O acesso é restrito a colaboradores com e-mail institucional.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center h-32 bg-white/10 rounded-2xl border-2 border-dashed border-white/30">
            <span className="text-sm">Espaço para imagem</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;