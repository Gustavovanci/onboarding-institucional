// src/components/ui/OnboardingTour.tsx
import 'intro.js/introjs.css';
import { Steps } from 'intro.js-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface OnboardingTourProps {
  enabled: boolean;
  onComplete: () => void;
}

export const OnboardingTour = ({ enabled, onComplete }: OnboardingTourProps) => {
  const { user, updateUserProfile } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const onExit = () => {
    if (user && !user.tourSeen) {
      updateUserProfile({ tourSeen: true });
    }
    onComplete();
    if (location.pathname !== '/dashboard') {
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
      intro: 'Sua jornada de conhecimento começa aqui! Estes são os módulos que você precisa completar.',
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

  const onBeforeChange = (nextStepIndex: number) => {
    const nextStep = steps[nextStepIndex];
    if (!nextStep) return;

    // Se o próximo passo é a página de perfil e não estamos lá, navega para lá.
    if (nextStep.element === '#tour-step-5-profile-page') {
      if (location.pathname !== '/profile') {
        navigate('/profile');
      }
    }
    // Para todos os outros passos, garante que estamos no dashboard.
    else if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
  };

  // Renderiza o componente Steps apenas se o tour estiver habilitado
  // Isso garante que ele não tente rodar prematuramente
  if (!enabled) {
    return null;
  }

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