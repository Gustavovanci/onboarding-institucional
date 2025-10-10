// ARQUIVO: src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useModulesStore } from "@/stores/modulesStore";
import Layout from "@/components/layout/Layout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProfileCheck from "@/components/auth/ProfileCheck";
import AppErrorBoundary from "@/components/common/AppErrorBoundary"; // Importa o Error Boundary

// Pages
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import ProfileSetupPage from "@/pages/ProfileSetupPage";
import ModulePage from "@/pages/ModulePage";
import ModulesGridPage from "@/pages/ModulesGridPage";
import RankingPage from "@/pages/RankingPage";
import ProfilePage from "@/pages/ProfilePage";
import QuizPage from "@/pages/QuizPage";
import CertificatesPage from "@/pages/CertificatesPage";
import BenefitsPage from "@/pages/BenefitsPage";
import CommunicationPage from "@/pages/CommunicationPage";
import InnovationPage from "@/pages/InnovationPage";
import MessagesPage from "@/pages/MessagesPage";

const TermsPage = () => (
    <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">Termos de Uso e Política de Privacidade</h1>
        <p className="mt-4">O conteúdo desta página está em desenvolvimento. Seus dados de perfil do Google (nome, e-mail e foto) são utilizados exclusivamente para identificação dentro da plataforma de Onboarding Institucional do HCFMUSP e não são compartilhados com terceiros.</p>
        <Link to="/login" className="text-blue-500 hover:underline mt-4 inline-block">&larr; Voltar para o Login</Link>
    </div>
);

function App() {
  const { isLoading: isAuthLoading, isAuthenticated, initializeAuthListener } = useAuthStore();
  const { fetchModules, hasFetched } = useModulesStore();

  useEffect(() => {
    const unsubscribe = initializeAuthListener();
    return () => unsubscribe();
  }, [initializeAuthListener]);

  useEffect(() => {
    if (isAuthenticated && !hasFetched) {
      fetchModules();
    }
  }, [isAuthenticated, hasFetched, fetchModules]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center"><LoadingSpinner /><p className="mt-4 text-gray-600">Carregando...</p></div>
      </div>
    );
  }

  return (
    <Router>
      <AppErrorBoundary> {/* <-- CORREÇÃO 9: Envolve as rotas para capturar erros */}
        <Routes>
          <Route path="/" element={!isAuthenticated ? <LandingPage /> : <Navigate to="/dashboard" />} />
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/terms" element={<TermsPage />} />
          
          <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>} />
          
          {/* Rotas protegidas que exigem perfil completo */}
          <Route element={<ProtectedRoute><ProfileCheck /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
            <Route path="/modules" element={<Layout><ModulesGridPage /></Layout>} />
            <Route path="/modules/:moduleId" element={<Layout><ModulePage /></Layout>} />
            <Route path="/modules/:moduleId/quiz" element={<QuizPage />} />
            <Route path="/ranking" element={<Layout><RankingPage /></Layout>} />
            <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
            
            {/* NOVAS ROTAS (ITENS 5 e 7) */}
            <Route path="/certificates" element={<Layout><CertificatesPage /></Layout>} />
            <Route path="/messages" element={<Layout><MessagesPage /></Layout>} />
            <Route path="/benefits" element={<Layout><BenefitsPage /></Layout>} />
            <Route path="/communication" element={<Layout><CommunicationPage /></Layout>} />
            <Route path="/innovation" element={<Layout><InnovationPage /></Layout>} />
          </Route>

          {/* Rota "catch-all" para páginas não encontradas */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center text-center p-4">
              <div>
                <h1 className="text-4xl font-bold">404 - Página não encontrada</h1>
                <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Voltar ao início</Link>
              </div>
            </div>
          } />
        </Routes>
      </AppErrorBoundary>
    </Router>
  );
}

export default App;