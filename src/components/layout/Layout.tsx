// src/components/layout/Layout.tsx
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuthStore } from '../../stores/authStore';
import WelcomeModal from '../ui/WelcomeModal';
import { StaticOnboardingTour } from '../ui/StaticOnboardingTour'; // CORREÇÃO: Importação correta
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

// NOVO: Definindo as imagens para o tour
const tourImages = [
  '/tour/step-1.png',
  '/tour/step-2.png',
  '/tour/step-3.png',
  '/tour/step-4.png',
  '/tour/step-5.png',
];


export default function Layout({ children }: LayoutProps) {
  const { user, updateUserProfile } = useAuthStore();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [startTour, setStartTour] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      if (!user.welcomeModalSeen && location.pathname === '/dashboard') {
        setShowWelcomeModal(true);
      }
    }
  }, [user, location.pathname]);

  const handleModalClose = (shouldStartTour: boolean) => {
    setShowWelcomeModal(false);
    if (user && !user.welcomeModalSeen) {
      updateUserProfile({ welcomeModalSeen: true });
    }
    if (shouldStartTour && user && !user.tourSeen) {
      setTimeout(() => setStartTour(true), 300);
    }
  };

  const handleTourComplete = () => {
    setStartTour(false);
    if (user && !user.tourSeen) {
      updateUserProfile({ tourSeen: true });
    }
  };

  return (
    <div className="flex h-screen bg-brand-light">
      {/* CORREÇÃO: Componente e propriedades corrigidas */}
      <StaticOnboardingTour
        isOpen={startTour}
        onClose={handleTourComplete}
        images={tourImages}
      />

      <AnimatePresence>
        {showWelcomeModal && (
          <WelcomeModal
            onClose={() => handleModalClose(false)}
            onStartTour={() => handleModalClose(true)}
          />
        )}
      </AnimatePresence>

      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}