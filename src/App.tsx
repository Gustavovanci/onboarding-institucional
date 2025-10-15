// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useModulesStore } from "@/stores/modulesStore";
import Layout from "@/components/layout/Layout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProfileCheck from "@/components/auth/ProfileCheck";
import AppErrorBoundary from "@/components/common/AppErrorBoundary";

// Pages
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import ProfileSetupPage from "@/pages/ProfileSetupPage";
import ModulePage from "@/pages/ModulePage";
import ModulesGridPage from "@/pages/ModulesGridPage";
import RankingPage from "@/pages/RankingPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";
import QuizPage from "@/pages/QuizPage";
import CertificatesPage from "@/pages/CertificatesPage";
import BenefitsPage from "@/pages/BenefitsPage";
import CommunicationPage from "@/pages/CommunicationPage";
import InnovationPage from "@/pages/InnovationPage";
import MessagesPage from "@/pages/MessagesPage";
import HistoryPage from "@/pages/HistoryPage";
import ContentPage from "@/pages/ContentPage";

// NOVAS PÁGINAS DO FLUXO DE BOAS-VINDAS
import BoasVindasPage from "@/pages/BoasVindasPage";
import NossoPapelSusPage from "@/pages/NossoPapelSusPage";
import BoasVindasQuizPage from "@/pages/BoasVindasQuizPage";


function App() {
  const { isLoading: isAuthLoading, isAuthenticated, initializeAuthListener } = useAuthStore();
  const { fetchModules, hasFetched, isLoading: isModulesLoading } = useModulesStore();

  useEffect(() => {
    const unsubscribe = initializeAuthListener();
    return () => unsubscribe();
  }, [initializeAuthListener]);

  useEffect(() => {
    if (isAuthenticated && !hasFetched) {
      fetchModules();
    }
  }, [isAuthenticated, hasFetched, fetchModules]);

  if (isAuthLoading || (isAuthenticated && !hasFetched && isModulesLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <p className="text-gray-600 animate-pulse">Carregando plataforma...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AppErrorBoundary>
        <Routes>
          <Route path="/" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
          
          <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>} />
          
          <Route element={<ProtectedRoute><ProfileCheck /></ProtectedRoute>}>
            <Route path="/inicio" element={<Navigate to="/dashboard" replace />} />
            
            {/* ROTAS DO NOVO FLUXO DE BOAS-VINDAS */}
            <Route path="/boas-vindas" element={<Layout><BoasVindasPage /></Layout>} />
            <Route path="/nosso-papel-sus" element={<Layout><NossoPapelSusPage /></Layout>} />
            <Route path="/boas-vindas/quiz" element={<BoasVindasQuizPage />} />

            {/* ROTAS EXISTENTES */}
            <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
            <Route path="/modules" element={<Layout><ModulesGridPage /></Layout>} />
            <Route path="/modules/nossa-historia" element={<Layout><HistoryPage /></Layout>} />
            <Route path="/modules/:moduleId" element={<Layout><ModulePage /></Layout>} />
            <Route path="/modules/:moduleId/quiz" element={<QuizPage />} />
            <Route path="/ranking" element={<Layout><RankingPage /></Layout>} />
            <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
            <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
            <Route path="/certificates" element={<Layout><CertificatesPage /></Layout>} />
            <Route path="/messages" element={<Layout><MessagesPage /></Layout>} />
            <Route path="/benefits" element={<Layout><BenefitsPage /></Layout>} />
            <Route path="/communication" element={<Layout><CommunicationPage /></Layout>} />
            <Route path="/innovation" element={<Layout><InnovationPage /></Layout>} />
            <Route path="/quem-somos" element={<Layout><ContentPage pageId="quem-somos" /></Layout>} />
          </Route>

          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center text-center p-4">
              <div>
                <h1 className="text-4xl font-bold">404 - Página não encontrada</h1>
                <p className="text-gray-500 mt-2">O endereço que você tentou acessar não existe.</p>
                <Link to="/" className="btn-primary mt-6">Voltar ao Início</Link>
              </div>
            </div>
          } />
        </Routes>
      </AppErrorBoundary>
    </Router>
  );
}

export default App;