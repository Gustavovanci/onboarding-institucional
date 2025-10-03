// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./stores/authStore";
import Layout from "./components/layout/Layout";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ProfileCheck from "./components/auth/ProfileCheck";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import RankingPage from "./pages/RankingPage";
import ContentPage from "./pages/ContentPage";
import ModulePage from "./pages/ModulePage";
import ModulesGridPage from "./pages/ModulesGridPage"; // <-- VAMOS ATIVAR ESTA

// --- Páginas que AINDA VAMOS CRIAR (permanecem comentadas) ---
// import QuizPage from "./pages/QuizPage";
// import OnboardingCompletionPage from "./pages/OnboardingCompletionPage";
// import MessagesPage from "./pages/MessagesPage";

function App() {
  const { isLoading, isAuthenticated, initializeAuthListener } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initializeAuthListener();
    return () => unsubscribe();
  }, [initializeAuthListener]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Carregando Onboarding HC...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* === ROTAS PÚBLICAS === */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />

        {/* === ROTAS DE FLUXO INICIAL === */}
        <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>} />
        
        {/* As rotas abaixo serão descomentadas nas próximas partes */}
        {/* <Route path="/completion" element={<ProtectedRoute><OnboardingCompletionPage /></ProtectedRoute>} /> */}
        {/* <Route path="/modules/:moduleId/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} /> */}

        {/* === ROTAS PRINCIPAIS DA APLICAÇÃO === */}
        <Route element={<ProtectedRoute><ProfileCheck /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/ranking" element={<Layout><RankingPage /></Layout>} />
          <Route path="/modules/:moduleId" element={<Layout><ModulePage /></Layout>} />
          <Route path="/content/:pageId" element={<Layout><ContentPage /></Layout>} />
          
          {/* ROTA ATIVADA ABAIXO */}
          <Route path="/modules" element={<Layout><ModulesGridPage /></Layout>} />

          {/* <Route path="/messages" element={<Layout><MessagesPage /></Layout>} /> */}
        </Route>

        {/* === ROTA 404 === */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900">404</h1>
                <p className="text-gray-600">Página não encontrada</p>
                <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Voltar ao início</Link>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;