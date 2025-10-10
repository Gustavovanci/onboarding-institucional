// src/pages/DashboardPage.tsx
import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Award, TrendingUp } from "lucide-react";

import WelcomeModal from "../components/ui/WelcomeModal";
import { StaticOnboardingTour } from '../components/ui/StaticOnboardingTour'; // Usaremos a versão estática
import { DeadlineCard } from "../components/dashboard/DeadlineCard";
import { InstituteRankingCard } from "../components/dashboard/InstituteRankingCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ProfileCard from "../components/dashboard/ProfileCard";
import { WelcomeHeader } from "../components/dashboard/WelcomeHeader";

import { INSTITUTOS_CONFIG } from "../types";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../utils/firebase";

// Array de imagens para o tour (adicione os caminhos corretos)
const tourImages = [
  '/tour/passo1.png',
  '/tour/passo2.png',
  '/tour/passo3.png',
  '/tour/passo4.png',
  '/tour/passo5.png',
];

export default function DashboardPage() {
  const { user, updateUserProfile } = useAuthStore();
  const [totalModules, setTotalModules] = useState(0);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [startTour, setStartTour] = useState(false);

  useEffect(() => {
    if (user && !user.welcomeModalSeen) {
      // Pequeno delay para garantir que a UI carregou antes de mostrar o modal
      setTimeout(() => {
        setShowWelcomeModal(true);
      }, 500);
    }
    
    const fetchModulesCount = async () => {
      const q = query(collection(db, "modules"));
      const querySnapshot = await getDocs(q);
      setTotalModules(querySnapshot.size);
    };

    if (user) {
      fetchModulesCount();
    }
  }, [user]);

  const handleModalClose = (shouldStartTour: boolean) => {
    setShowWelcomeModal(false);
    if (user && !user.welcomeModalSeen) {
      updateUserProfile({ welcomeModalSeen: true });
    }
    if (shouldStartTour && user && !user.tourSeen) {
      setTimeout(() => setStartTour(true), 300);
    }
  };

  const handleTourClose = () => {
    setStartTour(false);
    if (user && !user.tourSeen) {
      updateUserProfile({ tourSeen: true });
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }

  const institutConfig = user.instituto ? INSTITUTOS_CONFIG[user.instituto] : null;
  const completedModulesCount = user.completedModules?.length || 0;

  return (
    <>
      <AnimatePresence>
        {showWelcomeModal && (
          <WelcomeModal 
            onClose={() => handleModalClose(false)} 
            onStartTour={() => handleModalClose(true)} 
          />
        )}
      </AnimatePresence>

      <StaticOnboardingTour
        isOpen={startTour}
        onClose={handleTourClose}
        images={tourImages}
      />

      <div className="space-y-8">
        <WelcomeHeader />
        
        <div id="tour-step-2-main-profile-card">
          <ProfileCard
            user={user}
            institutConfig={institutConfig}
            completedModulesCount={completedModulesCount}
            totalModules={totalModules}
          />
        </div>

        <div id="tour-step-3-info-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <DeadlineCard />
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="card-elevated h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Suas Conquistas</h3>
                <p className="text-xs text-gray-500">Seu progresso até agora</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Pontos Totais</span><span className="font-bold text-green-700">{user.points || 0} pts</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Badges Ganhos</span><span className="font-bold text-green-700">{user.badges?.length || 0}</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Módulos Concluídos</span><span className="font-bold text-green-700">{completedModulesCount}</span></div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="card-elevated h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Sua Posição</h3>
                <p className="text-xs text-gray-500">Seu lugar na competição</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Ranking Geral</span><span className="font-bold text-purple-700">#{user.currentRank || 'N/A'}</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Ranking do Instituto</span><span className="font-bold text-purple-700">#{user.instituteRank || 'N/A'}</span></div>
              <Link to="/ranking" className="block text-center pt-2 text-purple-600 font-semibold hover:underline">Ver Ranking Completo</Link>
            </div>
          </motion.div>
        </div>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <InstituteRankingCard />
        </motion.div>
      </div>
    </>
  );
}