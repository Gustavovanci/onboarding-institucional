// src/components/ui/OnboardingTour.tsx
import { useEffect, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useAuthStore } from '@/stores/authStore';

interface OnboardingTourProps {
  run: boolean;
  onFinish: () => void;
}

const OnboardingTour = ({ run, onFinish }: OnboardingTourProps) => {
  const { user } = useAuthStore();
  const driverRef = useRef<ReturnType<typeof driver> | null>(null);

  useEffect(() => {
    if (!run || !user) return;

    const driverObj = driver({
      showProgress: true,
      progressText: 'Passo {{current}} de {{total}}',
      nextBtnText: 'Próximo →',
      prevBtnText: '← Voltar',
      doneBtnText: '✓ Finalizar',

      onDestroyStarted: () => {
        if (driverRef.current?.isActive()) {
            driverObj.destroy();
        }
        onFinish();
      },

      steps: [
        {
          element: 'body',
          popover: {
            title: `👋 Bem-vindo(a), ${user.displayName?.split(' ')[0]}!`,
            description: `
              <div class="space-y-3">
                <p class="text-gray-700">Vamos fazer um tour rápido pela plataforma para você conhecer as principais funcionalidades.</p>
                <p class="text-sm text-gray-600">⏱️ Leva apenas <strong>2 minutos</strong>!</p>
                <div class="bg-blue-50 border-l-4 border-blue-500 p-3 mt-3 rounded">
                  <p class="text-sm text-blue-800"><strong>💡 Dica:</strong> Você pode pular ou refazer este tour nas Configurações.</p>
                </div>
              </div>
            `,
            side: 'center',
            align: 'center',
          },
        },
        {
          element: '#tour-step-2-main-profile-card',
          popover: {
            title: '🎯 Seu Cartão de Perfil',
            description: `
              <div class="space-y-3">
                <p class="text-gray-700">Este é seu cartão de visitas na plataforma! Aqui você encontra:</p>
                <ul class="space-y-2 text-sm text-gray-700">
                  <li class="flex items-start gap-2">
                    <span class="text-yellow-500 font-bold">🏆</span>
                    <span><strong>Pontos acumulados</strong> - Ganhe completando módulos e atividades</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-blue-500 font-bold">📊</span>
                    <span><strong>Rankings</strong> - Sua posição geral e no seu instituto</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-purple-500 font-bold">🎖️</span>
                    <span><strong>Badges conquistados</strong> - Suas realizações especiais</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-green-500 font-bold">✅</span>
                    <span><strong>Módulos completados</strong> - Seu progresso na trilha</span>
                  </li>
                </ul>
                <div class="bg-purple-50 border-l-4 border-purple-500 p-2 mt-3 rounded">
                  <p class="text-xs text-purple-800"><strong>💡 Personalize:</strong> Acesse Configurações para mudar tema, emoji e título!</p>
                </div>
              </div>
            `,
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-step-3-info-cards',
          popover: {
            title: '⏰ Prazo e Métricas',
            description: `
              <div class="space-y-3">
                <p class="text-gray-700">Estes cards mostram informações cruciais sobre sua jornada:</p>
                
                <div class="space-y-2">
                  <div class="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-xl">⏰</span>
                      <strong class="text-blue-700">Prazo do Onboarding</strong>
                    </div>
                    <p class="text-sm text-gray-700">Você tem <strong>30 dias</strong> para completar sua trilha de integração.</p>
                  </div>
                  
                  <div class="bg-green-50 border border-green-200 p-3 rounded-lg">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-xl">🎯</span>
                      <strong class="text-green-700">Suas Conquistas</strong>
                    </div>
                    <p class="text-sm text-gray-700">Acompanhe seus pontos, badges e módulos completados.</p>
                  </div>
                  
                  <div class="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-xl">📈</span>
                      <strong class="text-purple-700">Sua Posição</strong>
                    </div>
                    <p class="text-sm text-gray-700">Veja seu ranking geral e no seu instituto.</p>
                  </div>
                </div>
                
                <div class="bg-orange-50 border-l-4 border-orange-500 p-3 mt-3 rounded">
                  <p class="text-xs text-orange-800"><strong>⚡ Badge Especial:</strong> Complete em até 7 dias e ganhe o "Maratonista"!</p>
                </div>
              </div>
            `,
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#tour-step-4-header-actions',
          popover: {
            title: '🔔 Notificações e Menu',
            description: `
              <div class="space-y-3">
                <p class="text-gray-700">No canto superior direito, você tem acesso rápido a:</p>
                
                <div class="space-y-3">
                  <div class="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
                    <span class="text-2xl">🔔</span>
                    <div>
                      <strong class="text-blue-700 block mb-1">Notificações</strong>
                      <p class="text-sm text-gray-700">Receba alertas em tempo real sobre:</p>
                      <ul class="text-xs text-gray-600 mt-1 ml-3 list-disc">
                        <li>Badges conquistados</li>
                        <li>Módulos completados</li>
                        <li>Certificados disponíveis</li>
                        <li>Mensagens importantes</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div class="flex items-start gap-3 bg-purple-50 p-3 rounded-lg">
                    <span class="text-2xl">👤</span>
                    <div>
                      <strong class="text-purple-700 block mb-1">Menu do Usuário</strong>
                      <p class="text-sm text-gray-700">Clique no avatar para acessar:</p>
                      <ul class="text-xs text-gray-600 mt-1 ml-3 list-disc">
                        <li>Meu Perfil completo</li>
                        <li>Configurações da conta</li>
                        <li>Sair da plataforma</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            `,
            side: 'bottom',
            align: 'end',
          },
        },
        {
          element: 'nav',
          popover: {
            title: '🧭 Menu de Navegação',
            description: `
              <div class="space-y-3">
                <p class="text-gray-700">Use o menu lateral para navegar entre as seções da plataforma:</p>
                
                <div class="grid grid-cols-1 gap-2 text-sm">
                  <div class="flex items-center gap-2 bg-blue-50 p-2 rounded">
                    <span class="text-lg">🏠</span>
                    <div>
                      <strong class="text-blue-700">Início</strong>
                      <p class="text-xs text-gray-600">Seu dashboard principal</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-2 bg-green-50 p-2 rounded">
                    <span class="text-lg">📚</span>
                    <div>
                      <strong class="text-green-700">Trilha Institucional</strong>
                      <p class="text-xs text-gray-600">Módulos de aprendizagem obrigatórios</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-2 bg-yellow-50 p-2 rounded">
                    <span class="text-lg">🏆</span>
                    <div>
                      <strong class="text-yellow-700">Ranking</strong>
                      <p class="text-xs text-gray-600">Compare-se com seus colegas</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-2 bg-purple-50 p-2 rounded">
                    <span class="text-lg">🎓</span>
                    <div>
                      <strong class="text-purple-700">Certificados</strong>
                      <p class="text-xs text-gray-600">Baixe seus certificados em PDF</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-2 bg-pink-50 p-2 rounded">
                    <span class="text-lg">☁️</span>
                    <div>
                      <strong class="text-pink-700">Nuvem de Ideias</strong>
                      <p class="text-xs text-gray-600">Palavras dos colaboradores</p>
                    </div>
                  </div>
                </div>
                
                <div class="bg-blue-50 border-l-4 border-blue-500 p-2 mt-3 rounded">
                  <p class="text-xs text-blue-800"><strong>💡 Dica Desktop:</strong> Você pode recolher/expandir o menu clicando na seta!</p>
                </div>
              </div>
            `,
            side: 'right',
            align: 'start',
          },
        },
        {
          element: 'body',
          popover: {
            title: '🎉 Tudo Pronto!',
            description: `
              <div class="text-center space-y-4">
                <div class="text-6xl mb-3">✨</div>
                <p class="text-gray-700 text-lg">Você já conhece os principais recursos da plataforma!</p>
                <p class="text-gray-600">Agora é hora de começar sua jornada de integração no HCFMUSP.</p>
                
                <div class="bg-green-50 border border-green-200 rounded-xl p-4 mt-4">
                  <div class="text-3xl mb-2">🚀</div>
                  <strong class="text-green-800 block mb-2">Próximo Passo:</strong>
                  <p class="text-sm text-green-700">Complete o módulo <strong>"Boas-Vindas"</strong> para ganhar seus primeiros <strong>100 pontos</strong> e o badge especial!</p>
                </div>
                
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                  <p class="text-xs text-blue-800">
                    <strong>💡 Lembre-se:</strong> Você pode refazer este tour a qualquer momento nas <strong>Configurações</strong>.
                  </p>
                </div>
              </div>
            `,
            side: 'center',
            align: 'center',
          },
        },
      ],
    });

    driverRef.current = driverObj;
    driverObj.drive();

    return () => {
      if (driverRef.current) {
        driverRef.current.destroy();
      }
    };
  }, [run, user, onFinish]);

  return null;
};

// Adiciona a exportação padrão
export default OnboardingTour;