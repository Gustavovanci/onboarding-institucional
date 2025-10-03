// src/pages/ModulesGridPage.tsx
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../utils/firebase";
import { Link } from "react-router-dom";
import { CheckCircle, Lock } from "lucide-react";
import { motion } from "framer-motion";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useAuthStore } from "../stores/authStore";
import { type Module } from "../types";

// A linha mais importante é esta abaixo, garantindo o "export default"
export default function ModulesGridPage() {
  const { user } = useAuthStore();
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "modules"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        const modulesList: Module[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Module, "id">),
        }));
        setModules(modulesList);
      } catch (err) {
        console.error("Erro ao buscar módulos:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchModules();
  }, []);

  const isModuleUnlocked = (moduleOrder: number) => {
    // O primeiro módulo (order: 1) está sempre desbloqueado.
    if (!user || moduleOrder === 1) return true;
    
    // Encontra o ID do módulo anterior (order - 1)
    const previousModule = modules.find(m => m.order === moduleOrder - 1);
    if (!previousModule) return true; // Caso de segurança: se não achar o anterior, desbloqueia.

    // Verifica se o ID do módulo anterior está na lista de completados do usuário.
    return user.completedModules.includes(previousModule.id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full pt-20">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">Trilha de Conhecimento</h1>
        <p className="mt-2 text-lg text-gray-600">Siga a jornada de aprendizado módulo por módulo para completar seu onboarding.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {modules.map((module, index) => {
          const completed = user?.completedModules?.includes(module.id);
          const unlocked = isModuleUnlocked(module.order);
          
          const cardContent = (
            <div className={`relative rounded-2xl shadow-lg border overflow-hidden h-full flex flex-col transition-all duration-300 ${!unlocked ? 'grayscale filter bg-gray-100' : 'bg-white hover:shadow-xl hover:-translate-y-1'}`}>
              <div className="relative">
                <img 
                  src={module.imageUrl || `https://picsum.photos/seed/${module.id}/400/200`} 
                  alt={module.title}
                  className="w-full h-40 object-cover"
                />
                {!unlocked && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                )}
                 {completed && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white p-2 rounded-full shadow-lg">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <div className={`text-xs font-bold px-2 py-1 rounded-full ${completed ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {module.category || 'Geral'}
                  </div>
                   <span className="text-xs font-bold text-gray-400">MÓDULO {module.order}</span>
                </div>
                <h3 className={`text-lg font-bold ${!unlocked ? 'text-gray-500' : 'text-gray-800'} flex-grow`}>{module.title}</h3>
                <p className={`text-sm ${!unlocked ? 'text-gray-400' : 'text-gray-500'} mt-2`}>{module.estimatedMinutes} min • {module.points} pts</p>
              </div>
            </div>
          );
          
          return (
            <motion.div 
              key={module.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="h-full"
            >
              {unlocked ? (
                <Link to={`/modules/${module.id}`} className="h-full block transition-transform hover:scale-105">
                  {cardContent}
                </Link>
              ) : (
                <div className="cursor-not-allowed h-full" title="Complete o módulo anterior para desbloquear.">
                  {cardContent}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  );
}