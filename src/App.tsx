// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProfileCheck from './components/auth/ProfileCheck';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import RankingPage from './pages/RankingPage';
import ModulePage from './pages/ModulePage';
import ContentPage from './pages/ContentPage';

function App() {
  const { user, isLoading, isAuthenticated, initializeAuthListener } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initializeAuthListener();
    return unsubscribe;
  }, [initializeAuthListener]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Carregando Onboarding HC...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
        />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
        />

        {/* Profile Setup Route */}
        <Route 
          path="/profile-setup" 
          element={
            <ProtectedRoute>
              <ProfileSetupPage />
            </ProtectedRoute>
          } 
        />

        {/* Protected Routes with Profile Check */}
        <Route element={<ProtectedRoute><ProfileCheck /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/ranking" element={<Layout><RankingPage /></Layout>} />
          <Route path="/modules/:moduleId" element={<Layout><ModulePage /></Layout>} />
          
          {/* Content Pages for Firebase modules */}
          <Route path="/institucional" element={<Layout><ContentPage pageId="institucional" /></Layout>} />
          <Route path="/identificacao" element={<Layout><ContentPage pageId="identificacao" /></Layout>} />
          <Route path="/sistemas" element={<Layout><ContentPage pageId="sistemas" /></Layout>} />
          <Route path="/voluntariado" element={<Layout><ContentPage pageId="voluntariado" /></Layout>} />
          <Route path="/comunicacao" element={<Layout><ContentPage pageId="comunicacao" /></Layout>} />
          <Route path="/relacionamentos" element={<Layout><ContentPage pageId="relacionamentos" /></Layout>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900">404</h1>
              <p className="text-gray-600">Página não encontrada</p>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;