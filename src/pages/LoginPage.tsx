// src/pages/LoginPage.tsx
import { LogIn, Shield, Sparkles } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const LoginPage = () => {
  const { loginWithGoogle, isLoading } = useAuthStore();

  const handleLogin = () => {
    // Apenas chama a função, o redirecionamento fará o resto
    loginWithGoogle();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-green-500">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full -mr-48 -mt-48 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-orange-400/20 to-transparent rounded-full -ml-36 -mb-36 animate-pulse delay-1000"></div>
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                Onboarding
                <span className="block bg-gradient-to-r from-orange-300 to-green-300 bg-clip-text text-transparent">
                  Institucional
                </span>
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Bem-vindo(a) à plataforma de integração do
                <span className="font-semibold"> Hospital das Clínicas</span>
              </p>
            </div>
            <button
              onClick={handleLogin} // Chama a nova função
              disabled={isLoading}
              className="group relative w-full overflow-hidden bg-white hover:bg-gray-50 text-blue-600 font-bold rounded-2xl text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 p-6 flex items-center justify-center space-x-3 border-2 border-white/20 disabled:opacity-70"
            >
              {isLoading ? (
                  <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              ) : (
                <>
                  <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                    <LogIn className="w-4 h-4 text-white" />
                  </div>
                  <span>Entrar com e-mail HC</span>
                </>
              )}
            </button>
            <div className="mt-8 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-white/80" />
                <div>
                  <p className="text-white/90 text-sm font-medium mb-1">Acesso Seguro</p>
                  <p className="text-white/70 text-xs">
                    Use seu e-mail corporativo para continuar. O acesso é restrito a colaboradores do HC.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="text-white/60 text-sm">
              © 2025 Hospital das Clínicas - Integração Digital
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;