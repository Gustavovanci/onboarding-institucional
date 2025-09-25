// src/pages/DashboardPage.tsx

import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../utils/firebase";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Sparkles, Play, Trophy, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import WelcomeModal from "../components/ui/WelcomeModal";
import { INSTITUTOS_CONFIG, type Module } from "../types";
// CORREÇÃO: A importação agora é 'default' (sem chaves {}).
import ProfileCard from "../components/dashboard/ProfileCard";

export default function DashboardPage() {
  const { user, updateUserProfile } = useAuthStore();
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    if (user && !user.welcomeModalSeen) setShowWelcomeModal(true);

    const fetchModules = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "modules"), orderBy("order", "asc"));
        const qs = await getDocs(q);
        const list: Module[] = qs.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Module, "id">) }));
        setModules(list);
      } catch (err) {
        console.error("Erro ao buscar módulos:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchModules();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
    if (user) updateUserProfile({ welcomeModalSeen: true });
  };

  const institutConfig = user ? INSTITUTOS_CONFIG[user.instituto] : null;
  const completedModulesCount = user?.completedModules?.length || 0;
  const totalModules = modules.length > 0 ? modules.length : 1;
  const progressPercentage = Math.round((completedModulesCount / totalModules) * 100);

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>{showWelcomeModal && <WelcomeModal onClose={handleCloseWelcomeModal} />}</AnimatePresence>

      <div className="max-w-6xl mx-auto space-y-8">
        <ProfileCard
          user={user}
          institutConfig={institutConfig}
          completedModulesCount={completedModulesCount}
          totalModules={totalModules}
        />

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-elevated">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Seu Progresso</h3>
              <TrendingUp className="w-5 h-5 text-brand-teal" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Completado</span><span className="font-bold">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-brand-azure to-brand-teal h-3 rounded-full" style={{ width: `${progressPercentage}%` }} />
                </div>
              </div>
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">{modules.length - completedModulesCount} módulos restantes</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-elevated">
            <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-gray-900">Conquistas</h3><Trophy className="w-5 h-5 text-yellow-500" /></div>
            <div className="space-y-3">
              <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Badges Coletados</span><span className="font-bold text-yellow-600">{user?.badges?.length || 0}</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Certificados</span><span className="font-bold text-brand-azure">{user?.certificates?.length || 0}</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-gray-600">Horas de Estudo</span><span className="font-bold text-brand-teal">~{Math.round((completedModulesCount * 15) / 60)}h</span></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-elevated">
            <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-gray-900">Ações Rápidas</h3><Sparkles className="w-5 h-5 text-purple-500" /></div>
            <div className="space-y-3">
              <Link to="/ranking" className="block w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-center font-medium text-brand-azure">Ver Ranking</Link>
              <Link to="/profile" className="block w-full p-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-center font-medium text-purple-700">Personalizar Perfil</Link>
            </div>
          </motion.div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Todos os Módulos</h2>
            <Link to="/modules" className="text-brand-azure hover:underline font-medium flex items-center">
              Ver em grade <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          {modules.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module, index) => (
                <motion.div key={module.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} whileHover={{ scale: 1.03, y: -5 }} className="group">
                  <Link to={`/modules/${module.id}`}>
                    <div className="bg-white rounded-2xl shadow-card border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><BookOpen className="w-6 h-6 text-brand-azure" /></div>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">Módulo {module.order}</span>
                        </div>
                        <h3 className="text-gray-900 font-bold text-lg leading-tight mb-2">{module.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{module.description}</p>
                      </div>
                      <div className="mt-auto p-6 bg-gray-50/70">
                        <div className="flex items-center justify-between">
                          <span className="text-brand-azure font-semibold group-hover:underline">Iniciar Módulo</span>
                          <div className="w-10 h-10 bg-brand-azure group-hover:scale-110 rounded-full flex items-center justify-center transition-transform">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl">
              <Trophy className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900">Nenhum módulo disponível.</h3>
              <p className="text-gray-600">Em breve, novos conteúdos por aqui.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}