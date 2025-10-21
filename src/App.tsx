import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useModulesStore } from "@/stores/modulesStore";
import { useProgressStore } from "@/stores/progressStore";
import Layout from "@/components/layout/Layout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProfileCheck from "@/components/auth/ProfileCheck";
import AppErrorBoundary from "@/components/common/AppErrorBoundary";

// Pages
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import ProfileSetupPage from "@/pages/ProfileSetupPage";
import ModulePage from "@/pages/ModulePage"; // Genérico Firebase
import ModulesGridPage from "@/pages/ModulesGridPage";
import RankingPage from "@/pages/RankingPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";
import QuizPage from "@/pages/QuizPage"; // Genérico Firebase
import CertificatesPage from "@/pages/CertificatesPage";
import MessagesPage from "@/pages/MessagesPage";
import HistoryPage from "@/pages/HistoryPage"; // Conteúdo do módulo 'nossa-historia'
import InnovationPage from "@/pages/InnovationPage";
import InnovationQuizPage from "@/pages/InnovationQuizPage";
import BoasVindasPage from "@/pages/BoasVindasPage";
import NossoPapelSusPage from "@/pages/NossoPapelSusPage";
import BoasVindasQuizPage from "@/pages/BoasVindasQuizPage";
import QuemSomosPage from "@/pages/QuemSomosPage";
import QuemSomosQuizPage from "@/pages/QuemSomosQuizPage";
import SegurancaTrabalhoPage from "@/pages/SegurancaTrabalhoPage";
import SegurancaTrabalhoQuizPage from "@/pages/SegurancaTrabalhoQuizPage";
import BenefitsPage from "@/pages/BenefitsPage";
import BenefitsQuizPage from "@/pages/BenefitsQuizPage";
import HumanizacaoPage from "@/pages/HumanizacaoPage";
import HumanizacaoQuizPage from "@/pages/HumanizacaoQuizPage";
import ComunicacaoRHPage from "@/pages/ComunicacaoRHPage";
import ComunicacaoRHQuizPage from "@/pages/ComunicacaoRHQuizPage";
import SistemaHCFMUSPPage from "@/pages/SistemaHCFMUSPPage";
import ContentPage from "@/pages/ContentPage";
import GuiasCondutaPage from "@/pages/GuiasCondutaPage";
import GuiasCondutaQuizPage from "@/pages/GuiasCondutaQuizPage";


// ADMIN
import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import UserManagementPage from "@/pages/UserManagementPage";

function App() {
  const { user, isLoading: isAuthLoading, isAuthenticated, initializeAuthListener } = useAuthStore();
  const { fetchModules, hasFetched } = useModulesStore();
  const { runRetroactiveChecks } = useProgressStore();

  useEffect(() => {
    const unsubscribe = initializeAuthListener();
    return () => unsubscribe();
  }, [initializeAuthListener]);

  useEffect(() => {
    if (isAuthenticated) {
      if (!hasFetched) fetchModules();
      if (user) runRetroactiveChecks();
    }
  }, [isAuthenticated, user, hasFetched, fetchModules, runRetroactiveChecks]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <div className="text-center space-y-4"><LoadingSpinner /><p className="text-gray-600 animate-pulse">Carregando...</p></div>
      </div>
    );
  }

  return (
    <Router>
      <AppErrorBoundary>
        <Routes>
          {/* ROTAS PÚBLICAS */}
          <Route path="/" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* ROTA DE CONFIGURAÇÃO DE PERFIL */}
          <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>} />

          {/* ROTAS DO PORTAL ADMIN */}
          <Route path="/admin/dashboard" element={<AdminLayout><ProtectedRoute requiredRole="admin"><AdminDashboardPage /></ProtectedRoute></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><ProtectedRoute requiredRole="admin"><UserManagementPage /></ProtectedRoute></AdminLayout>} />

          {/* ROTAS PROTEGIDAS DO USUÁRIO */}
          <Route element={<ProtectedRoute><ProfileCheck /></ProtectedRoute>}>
            {/* Rotas Principais */}
            <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
            <Route path="/modules" element={<Layout><ModulesGridPage /></Layout>} />
            <Route path="/ranking" element={<Layout><RankingPage /></Layout>} />
            <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
            <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
            <Route path="/certificates" element={<Layout><CertificatesPage /></Layout>} />
            <Route path="/messages" element={<Layout><MessagesPage /></Layout>} />

            {/* Páginas de Conteúdo Estático (com Quiz próprio) */}
            <Route path="/boas-vindas" element={<Layout><BoasVindasPage /></Layout>} />
            <Route path="/nosso-papel-sus" element={<Layout><NossoPapelSusPage /></Layout>} />
            <Route path="/quem-somos" element={<Layout><QuemSomosPage /></Layout>} />
            <Route path="/seguranca-trabalho" element={<Layout><SegurancaTrabalhoPage /></Layout>} />
            <Route path="/benefits" element={<Layout><BenefitsPage /></Layout>} />
            <Route path="/innovation" element={<Layout><InnovationPage /></Layout>} />
            <Route path="/humanizacao" element={<Layout><HumanizacaoPage /></Layout>} />
            <Route path="/comunicacao-rh" element={<Layout><ComunicacaoRHPage /></Layout>} />
            <Route path="/guias-conduta" element={<Layout><GuiasCondutaPage /></Layout>} />
            <Route path="/sistemas-hcfmusp" element={<Layout><SistemaHCFMUSPPage /></Layout>} />
            
              {/* Página de Conteúdo Dinâmico (Firebase) - Se ainda for usar */}
              <Route path="/comunicacao" element={<Layout><ContentPage pageId="comunicacao" /></Layout>} />

              {/* Rota Específica para Módulo História (Layout Próprio) */}
              <Route path="/modules/nossa-historia" element={<Layout><HistoryPage /></Layout>} />

            {/* ROTAS DOS QUIZZES ESPECÍFICOS */}
            <Route path="/boas-vindas/quiz" element={<BoasVindasQuizPage />} />
            <Route path="/quem-somos/quiz" element={<QuemSomosQuizPage />} />
            <Route path="/seguranca-trabalho/quiz" element={<SegurancaTrabalhoQuizPage />} />
            <Route path="/benefits/quiz" element={<BenefitsQuizPage />} />
            <Route path="/innovation/quiz" element={<InnovationQuizPage />} />
            <Route path="/humanizacao/quiz" element={<HumanizacaoQuizPage />} />
            <Route path="/comunicacao-rh/quiz" element={<ComunicacaoRHQuizPage />} />
            <Route path="/guias-conduta/quiz" element={<GuiasCondutaQuizPage />} />

            {/* Rotas Genéricas de Módulo/Quiz (do Firebase - para módulos não estáticos) */}
            <Route path="/modules/:moduleId" element={<Layout><ModulePage /></Layout>} />
            <Route path="/modules/:moduleId/quiz" element={<QuizPage />} />
          </Route>

          {/* Rota 404 */}
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-center p-4"><div><h1 className="text-4xl font-bold">404 - Página não encontrada</h1><p className="text-gray-500 mt-2">O endereço que você tentou acessar não existe.</p><Link to="/" className="btn-primary mt-6">Voltar ao Início</Link></div></div>} />
        </Routes>
      </AppErrorBoundary>
    </Router>
  );
}

export default App;