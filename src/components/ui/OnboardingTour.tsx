// src/components/ui/OnboardingTour.tsx
import 'intro.js/introjs.css';
import { Steps } from 'intro.js-react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

// ATENÇÃO: A linha abaixo DEVE ser "export const", não "export default"
export const OnboardingTour = () => {
  const [enabled, setEnabled] = useState(true);
  const { user, updateUserProfile } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const onExit = () => {
    setEnabled(false);
    if (user && !user.tourSeen) {
      updateUserProfile({ tourSeen: true });
    }
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
  };

  const onBeforeChange = (nextStepIndex: number) => {
    const steps = [ /* ... seu array de steps aqui ... */ ];
    if (steps[nextStepIndex]?.element === '#tour-step-5-profile-page') {
      if (location.pathname !== '/profile') {
        navigate('/profile');
      }
    } else if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
  };

  const steps = [
    {
      element: '#tour-step-1-sidebar',
      intro: 'Bem-vindo(a)! Esta é a sua barra de navegação. Use-a para acessar as principais áreas da plataforma.',
      position: 'right',
    },
    {
      element: '#tour-step-2-profile-card',
      intro: 'Este é o seu cartão de perfil. Aqui você pode ver seu progresso, pontos e ranking de forma rápida.',
      position: 'bottom',
    },
    {
      element: '#tour-step-3-modules-grid',
      intro: 'Sua jornada de conhecimento começa aqui! Estes são os módulos que você precisa completar. Clique em "Ver todos" para começar.',
      position: 'top',
    },
    {
      element: '#tour-step-4-header-actions',
      intro: 'Fique de olho em suas conquistas (badges) e notificações aqui. Vamos agora personalizar seu perfil!',
      position: 'left',
    },
    {
      element: '#tour-step-5-profile-page',
      title: 'Personalize sua Experiência',
      intro: 'Nesta página você pode editar seu perfil. Clique no botão "Editar Perfil" para mudar suas cores, emoji e título!',
      position: 'bottom',
    },
  ];

  useEffect(() => {
    if (location.pathname !== '/dashboard') {
      setEnabled(false);
    } else if (!user?.tourSeen) {
      setEnabled(true);
    }
  }, [location.pathname, user?.tourSeen]);

  return (
    <Steps
      enabled={enabled}
      steps={steps}
      initialStep={0}
      onExit={onExit}
      onBeforeChange={onBeforeChange}
      options={{
        nextLabel: 'Próximo',
        prevLabel: 'Anterior',
        doneLabel: 'Finalizar Tour',
        tooltipClass: 'custom-tooltip',
        showProgress: true,
        exitOnOverlayClick: false,
      }}
    />
  );
};