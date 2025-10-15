// ARQUIVO: src/pages/ModulesGridPage.tsx
import { Link } from "react-router-dom";
import { CheckCircle, Lock, BookOpen, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useAuthStore } from "../stores/authStore";
import { useModulesStore } from "../stores/modulesStore";
import { type Module } from "../types";

export default function ModulesGridPage() {
  const { user } = useAuthStore();
  const { modules, isLoading } = useModulesStore();

  const isModuleUnlocked = (module: Module): boolean => {
    if (!user) return false;

    // LÓGICA DE DESBLOQUEIO CORRIGIDA
    // Se o módulo NÃO for obrigatório (Ex: HCX)
    if (!module.isRequired) {
      // Ele só é desbloqueado se o onboarding geral já foi marcado como concluído
      return user.onboardingCompleted;
    }

    // Para módulos obrigatórios
    if (module.order === 1) return true; // O primeiro é sempre desbloqueado
    
    const previousModule = modules.find(m => m.order === module.order - 1 && m.isRequired);
    if (!previousModule) return true; 
    
    return user.completedModules.includes(previousModule.id);
  };

  if (isLoading && modules.length === 0) {
    return (
      <div className="flex justify-center items-center h-full pt-20">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">Trilha de Conhecimento</h1>
        <p className="mt-2 text-lg text-gray-600">Siga a jornada de aprendizado módulo por módulo para completar seu onboarding.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {modules.map((module, index) => {
          const completed = user?.completedModules?.includes(module.id);
          const unlocked = isModuleUnlocked(module);
          
          const CardContent = () => (
            <div className={`relative group bg-white rounded-2xl shadow-lg border border-gray-200/60 overflow-hidden h-full flex flex-col transition-all duration-300 ${!unlocked ? 'grayscale filter' : 'hover:shadow-xl hover:-translate-y-1'}`}>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${completed ? 'bg-green-100' : 'bg-blue-100'}`}>
                    {module.url ? <ExternalLink className="w-6 h-6 text-blue-600"/> : (completed ? <CheckCircle className="w-6 h-6 text-green-600"/> : <BookOpen className="w-6 h-6 text-blue-600"/>)}
                  </div>
                  <span className="text-xs font-bold text-gray-400">{module.isRequired ? `MÓDULO ${module.order}` : 'BÔNUS'}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mt-4 h-14">{module.title}</h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-3">{module.description}</p>
              </div>
              <div className="mt-auto px-6 py-4 bg-gray-50 border-t border-gray-200/60">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-gray-600">{module.estimatedMinutes} min</span>
                  {module.points > 0 && <span className={`${completed ? 'text-green-600' : 'text-blue-600'}`}>+{module.points} pts</span>}
                </div>
              </div>
              {!unlocked && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                  <Lock className="w-8 h-8 text-gray-400 mb-2"/>
                  <p className="font-semibold text-gray-600">Bloqueado</p>
                  <p className="text-xs text-gray-500">{module.isRequired ? 'Conclua o módulo anterior.' : 'Conclua todos os módulos obrigatórios.'}</p>
                </div>
              )}
            </div>
          );
          
          return (
            <motion.div key={module.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="h-full">
              {unlocked ? (
                module.url ? (
                  <a href={module.url} target="_blank" rel="noopener noreferrer" className="h-full block">{CardContent()}</a>
                ) : (
                  <Link to={`/modules/${module.id}`} className="h-full block">{CardContent()}</Link>
                )
              ) : (
                <div className="cursor-not-allowed h-full">{CardContent()}</div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}