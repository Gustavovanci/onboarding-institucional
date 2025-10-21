// src/pages/DashboardPage.tsx
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Award, TrendingUp } from "lucide-react";

// ✅ Importa useAuthStore para LER o estado atualizado do usuário
import { useAuthStore } from "../stores/authStore";
import { useModulesStore } from "../stores/modulesStore";
import useGamificationStore from "../stores/gamificationStore";
import { useProgressStore } from "../stores/progressStore";
import WelcomeModal from "../components/ui/WelcomeModal";
import OnboardingTour from '../components/ui/OnboardingTour';
import { DeadlineCard } from "../components/dashboard/DeadlineCard";
import { InstituteRankingCard } from "../components/dashboard/InstituteRankingCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ProfileCard from "../components/dashboard/ProfileCard";
import { WelcomeHeader } from "../components/dashboard/WelcomeHeader";
import { INSTITUTOS_CONFIG } from "../types";

const REQUIRED_PAGE_QUIZZES_DASHBOARD = [
    'boas-vindas', 'quem-somos', 'seguranca-trabalho', 'beneficios',
    'guias-conduta', 'inovahc', 'humanizacao', 'comunicacao-rh',
];
const TOTAL_REQUIRED_ITEMS = 9;

export default function DashboardPage() {
  // ✅ Lê o usuário diretamente do authStore. Ele será atualizado pelo progressStore.
  const { user, updateUserProfile } = useAuthStore();
  const { modules, isLoading: isLoadingModules, hasFetched: hasFetchedModules } = useModulesStore();
  const { leaderboard, instituteLeaderboards, fetchLeaderboard, fetchInstituteLeaderboard } = useGamificationStore();
  const { awardBadgeAndPoints } = useProgressStore();
  const processedFirstStepBadge = useRef(false);
  const navigate = useNavigate();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [startTour, setStartTour] = useState(false);

  // --- Hooks ---
  useEffect(() => { /* ... Welcome Modal ... */ }, [user]);
  useEffect(() => { /* ... Fetch Leaderboards ... */ }, [user?.uid, user?.instituto, fetchLeaderboard, fetchInstituteLeaderboard]);
  useEffect(() => { /* ... Atualiza Ranking Local ... */ }, [leaderboard, instituteLeaderboards, user]);
  useEffect(() => { /* ... Badge Primeiro Passo ... */
      if (user && !processedFirstStepBadge.current && !user.badges?.includes('first-module')) {
          const totalCompleted = (user.completedModules?.length || 0) + (user.completedPageQuizzes?.length || 0);
          if (totalCompleted === 1) {
              console.log("[Dashboard] Primeiro item completo. Concedendo 'first-module'.");
              awardBadgeAndPoints(user.uid, 'first-module');
              processedFirstStepBadge.current = true;
          } else if (totalCompleted > 1) {
               console.log("[Dashboard] Mais de um item completo, marcando 'first-module' como processado.");
              processedFirstStepBadge.current = true;
          }
      }
  }, [user, user?.completedModules, user?.completedPageQuizzes, awardBadgeAndPoints]); // Garante reavaliação
  // --- Fim Hooks ---

  const handleModalClose = (shouldStartTour = false) => { /* ... */ };
  const handleTourClose = () => { /* ... */ };

  // --- Loading Check ---
  // ✅ Verifica se o user (do authStore) já carregou
  if (useAuthStore.getState().isLoading || isLoadingModules || !hasFetchedModules) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }
  // ✅ Garante que temos um usuário após o loading
  if (!user) {
     console.error("Dashboard renderizado sem usuário após loading!");
     // Pode redirecionar para login ou mostrar mensagem de erro
     return <div className="flex justify-center items-center h-screen">Erro ao carregar dados do usuário. Tente recarregar.</div>;
  }
  // --- Fim Loading Check ---


  // --- Cálculo de Progresso (usando o 'user' lido do authStore) ---
  const institutConfig = user.instituto ? INSTITUTOS_CONFIG[user.instituto] : null;
  const completedPageQuizzesCount = REQUIRED_PAGE_QUIZZES_DASHBOARD.filter(id => user.completedPageQuizzes?.includes(id)).length;
  const requiredSubModules = modules.filter(m => m.isRequired && !m.url);
  const allSubModulesCompleted = requiredSubModules.length > 0 && requiredSubModules.every(m => user.completedModules?.includes(m.id));
  const displayCompletedItems = completedPageQuizzesCount + (allSubModulesCompleted ? 1 : 0);
  // --- Fim Cálculo ---

  console.log("[Dashboard Render] User:", user); // Log para depuração
  console.log("[Dashboard Render] Itens Completos:", displayCompletedItems);

  return (
    <>
      {/* ... AnimatePresence e OnboardingTour ... */}
      <AnimatePresence> {showWelcomeModal && <WelcomeModal onClose={() => handleModalClose(false)} onStartTour={() => handleModalClose(true)} />} </AnimatePresence>
      <OnboardingTour run={startTour} onFinish={handleTourClose} />

      <div className="space-y-8">
        <WelcomeHeader />
        <div id="tour-step-2-main-profile-card">
          <ProfileCard
             user={user} // Passa o usuário lido do store
             institutConfig={institutConfig}
             completedModulesCount={displayCompletedItems}
             totalModules={TOTAL_REQUIRED_ITEMS}
           />
        </div>
        <div id="tour-step-3-info-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}> <DeadlineCard /> </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="card-elevated h-full">
            {/* ... Conteúdo Suas Conquistas ... */}
             <div className="flex items-center gap-4 mb-4"> <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"> <Award className="w-6 h-6 text-green-600" /> </div> <div> <h3 className="font-bold text-gray-800">Suas Conquistas</h3> <p className="text-xs text-gray-500">Seu progresso</p> </div> </div>
             <div className="space-y-3">
                 <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Pontos Totais</span><span className="font-bold text-green-700">{user.points || 0} pts</span></div>
                 <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Badges Ganhos</span><span className="font-bold text-green-700">{user.badges?.length || 0}</span></div>
                 <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Itens Concluídos</span><span className="font-bold text-green-700">{displayCompletedItems} de {TOTAL_REQUIRED_ITEMS}</span></div> {/* ✅ Mostra contagem correta */}
             </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="card-elevated h-full">
             {/* ... Conteúdo Sua Posição ... */}
              <div className="flex items-center gap-4 mb-4"> <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"> <TrendingUp className="w-6 h-6 text-purple-600" /> </div> <div> <h3 className="font-bold text-gray-800">Sua Posição</h3> <p className="text-xs text-gray-500">Seu lugar</p> </div> </div>
              <div className="space-y-3">
                 <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Ranking Geral</span><span className="font-bold text-purple-700">{user.currentRank > 0 ? `#${user.currentRank}` : '-'}</span></div>
                 <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Ranking do Instituto</span><span className="font-bold text-purple-700">{user.instituteRank > 0 ? `#${user.instituteRank}` : '-'}</span></div>
                 <Link to="/ranking" className="block text-center pt-2 text-purple-600 font-semibold hover:underline">Ver Ranking Completo</Link>
              </div>
           </motion.div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}> <InstituteRankingCard /> </motion.div>
      </div>
    </>
  );
}