// src/pages/DashboardPage.tsx
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Award, TrendingUp } from "lucide-react";

import { useAuthStore } from "../stores/authStore";
import { useModulesStore } from "../stores/modulesStore";
import useGamificationStore from "../stores/gamificationStore";
import { useProgressStore } from "../stores/progressStore"; // Removed unused import checkAndCompleteOnboarding
import WelcomeModal from "../components/ui/WelcomeModal";
import OnboardingTour from '../components/ui/OnboardingTour';
import { DeadlineCard } from "../components/dashboard/DeadlineCard";
import { InstituteRankingCard } from "../components/dashboard/InstituteRankingCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ProfileCard from "../components/dashboard/ProfileCard";
import { WelcomeHeader } from "../components/dashboard/WelcomeHeader";
import { INSTITUTOS_CONFIG } from "../types";

// --- CORREÇÃO: Total de itens obrigatórios revertido para 6 ---
const TOTAL_REQUIRED_ITEMS = 6;
// --- FIM CORREÇÃO ---

// Removed REQUIRED_PAGE_QUIZZES_DASHBOARD array

export default function DashboardPage() {
  const { user, updateUserProfile } = useAuthStore(); // Removed unused updateUserProfile if not used elsewhere
  const { modules, isLoading: isLoadingModules, hasFetched: hasFetchedModules } = useModulesStore();
  const { leaderboard, instituteLeaderboards, fetchLeaderboard, fetchInstituteLeaderboard } = useGamificationStore();
  const { awardBadgeAndPoints } = useProgressStore(); // Removed unused checkAndCompleteOnboarding
  const processedFirstStepBadge = useRef(false);
  const navigate = useNavigate();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [startTour, setStartTour] = useState(false);

  // --- Hooks ---
  useEffect(() => {
    // Logic for showing Welcome Modal based on user.welcomeModalSeen
    // Ensure user is loaded before checking
    if (user && !user.welcomeModalSeen && !useAuthStore.getState().isLoading) {
        setShowWelcomeModal(true);
        // Mark modal as seen immediately to prevent re-showing on quick refreshes
        // This is optimistic; a more robust approach might wait for modal close
        useAuthStore.getState().updateUserProfile({ welcomeModalSeen: true });
    }
   }, [user]); // Depend only on user object

  useEffect(() => {
    // Fetch leaderboards if user exists and has an institute
    if (user?.uid && user.instituto) {
        fetchLeaderboard(); // Fetch general leaderboard
        fetchInstituteLeaderboard(user.instituto); // Fetch institute leaderboard
    }
  }, [user?.uid, user?.instituto, fetchLeaderboard, fetchInstituteLeaderboard]);

  useEffect(() => {
    // Update local ranking based on fetched leaderboards - No changes needed here
    // Example: Find user's rank in leaderboard and instituteLeaderboards[user.institute]
    // and update user state if necessary (or rely on backend updates)
  }, [leaderboard, instituteLeaderboards, user]);

  useEffect(() => {
    // Award 'first-module' badge logic
    if (user && !processedFirstStepBadge.current && !user.badges?.includes('first-module')) {
        // --- CORREÇÃO: Calculate total completed based only on completedModules and completedPageQuizzes lengths ---
        const totalCompleted = (user.completedModules?.length || 0) + (user.completedPageQuizzes?.length || 0);
        // --- FIM CORREÇÃO ---
        if (totalCompleted === 1) {
            console.log("[Dashboard] Primeiro item completo. Concedendo 'first-module'.");
            awardBadgeAndPoints(user.uid, 'first-module');
            processedFirstStepBadge.current = true;
        } else if (totalCompleted > 1) {
            console.log("[Dashboard] Mais de um item completo, marcando 'first-module' como processado.");
            processedFirstStepBadge.current = true; // Mark as processed if user already completed more than one
        }
    }
  }, [user, awardBadgeAndPoints]); // Removed completedModules/PageQuizzes direct dependency, rely on user object change


  // --- Fim Hooks ---

  // Modal and Tour close handlers
  const handleModalClose = (shouldStartTour = false) => {
    setShowWelcomeModal(false);
    if (shouldStartTour) {
      setStartTour(true);
      // Mark tour as seen if they start it
      if (user && !user.tourSeen) {
        useAuthStore.getState().updateUserProfile({ tourSeen: true });
      }
    }
  };

  const handleTourClose = () => {
    setStartTour(false);
    // Ensure tourSeen is marked true even if they close it prematurely
    if (user && !user.tourSeen) {
       useAuthStore.getState().updateUserProfile({ tourSeen: true });
    }
  };

  // --- Loading Check ---
  if (useAuthStore.getState().isLoading || isLoadingModules || !hasFetchedModules) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }
  if (!user) {
     console.error("Dashboard renderizado sem usuário após loading!");
     return <div className="flex justify-center items-center h-screen">Erro ao carregar dados do usuário. Tente recarregar.</div>;
  }
  // --- Fim Loading Check ---


  // --- Cálculo de Progresso ---
  const institutConfig = user.instituto ? INSTITUTOS_CONFIG[user.instituto] : null;

  // --- CORREÇÃO: Calculate completed items based on required modules from the store ---
  // Count how many modules in the user's completedModules list are marked as isRequired in the fetched modules data.
  const requiredModulesCompletedCount = modules.filter(m => m.isRequired && user.completedModules?.includes(m.id)).length;
  const displayCompletedItems = requiredModulesCompletedCount;
  // --- FIM CORREÇÃO ---

  console.log("[Dashboard Render] User:", user);
  console.log("[Dashboard Render] Módulos Requeridos Completos:", displayCompletedItems);
  console.log("[Dashboard Render] Total Módulos Requeridos:", TOTAL_REQUIRED_ITEMS);


  return (
    <>
      <AnimatePresence> {showWelcomeModal && <WelcomeModal onClose={() => handleModalClose(false)} onStartTour={() => handleModalClose(true)} />} </AnimatePresence>
      <OnboardingTour run={startTour} onFinish={handleTourClose} />

      <div className="space-y-8">
        <WelcomeHeader />
        <div id="tour-step-2-main-profile-card">
          <ProfileCard
             user={user}
             institutConfig={institutConfig}
             completedModulesCount={displayCompletedItems} // Passa a contagem correta
             totalModules={TOTAL_REQUIRED_ITEMS} // Passa o total correto
           />
        </div>
        <div id="tour-step-3-info-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}> <DeadlineCard /> </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="card-elevated h-full">
             <div className="flex items-center gap-4 mb-4"> <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"> <Award className="w-6 h-6 text-green-600" /> </div> <div> <h3 className="font-bold text-gray-800">Suas Conquistas</h3> <p className="text-xs text-gray-500">Seu progresso</p> </div> </div>
             <div className="space-y-3">
                 <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Pontos Totais</span><span className="font-bold text-green-700">{user.points || 0} pts</span></div>
                 <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Badges Ganhos</span><span className="font-bold text-green-700">{user.badges?.length || 0}</span></div>
                 {/* --- CORREÇÃO: Mostra contagem correta baseada nos módulos requeridos --- */}
                 <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Módulos Concluídos</span><span className="font-bold text-green-700">{displayCompletedItems} de {TOTAL_REQUIRED_ITEMS}</span></div>
                 {/* --- FIM CORREÇÃO --- */}
             </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="card-elevated h-full">
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