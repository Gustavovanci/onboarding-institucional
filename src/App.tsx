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
import QuizPage from "@/pages/QuizPage";
import CertificatesPage from "@/pages/CertificatesPage";
import BenefitsPage from "@/pages/BenefitsPage";
import CommunicationPage from "@/pages/CommunicationPage";
import InnovationPage from "@/pages/InnovationPage";
import MessagesPage from "@/pages/MessagesPage";
import HistoryPage from "@/pages/HistoryPage"; // <-- Importa a nova página

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
      <AppErrorBoundary>
        <Routes>
          {/* Rota principal agora é a LoginPage */}
          <Route path="/" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
          
          <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>} />
          
          <Route element={<ProtectedRoute><ProfileCheck /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
            <Route path="/modules" element={<Layout><ModulesGridPage /></Layout>} />
            {/* Rota para o novo módulo de história */}
            <Route path="/modules/nossa-historia" element={<Layout><HistoryPage /></Layout>} />
            <Route path="/modules/:moduleId" element={<Layout><ModulePage /></Layout>} />
            <Route path="/modules/:moduleId/quiz" element={<QuizPage />} />
            <Route path="/ranking" element={<Layout><RankingPage /></Layout>} />
            <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
            <Route path="/certificates" element={<Layout><CertificatesPage /></Layout>} />
            <Route path="/messages" element={<Layout><MessagesPage /></Layout>} />
            <Route path="/benefits" element={<Layout><BenefitsPage /></Layout>} />
            <Route path="/communication" element={<Layout><CommunicationPage /></Layout>} />
            <Route path="/innovation" element={<Layout><InnovationPage /></Layout>} />
          </Route>

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