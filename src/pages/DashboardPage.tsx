import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  Play, 
  CheckCircle, 
  Trophy, 
  Clock,
  Award,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { INSTITUTOS_CONFIG } from '../types';

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  points: number;
  estimatedMinutes: number;
  category: string;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const q = query(collection(db, "modules"), orderBy("order"));
        const querySnapshot = await getDocs(q);
        const modulesList: Module[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Module[];
        setModules(modulesList);
      } catch (error) {
        console.error("Erro ao buscar módulos: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchModules();
  }, []);

  const firstName = user?.displayName?.split(' ')[0] || 'Usuário';
  const institutConfig = user ? INSTITUTOS_CONFIG[user.instituto] : null;

  // Stats do usuário
  const completedModulesCount = user?.completedModules?.length || 0;
  const totalModules = modules.length;
  const progressPercentage = totalModules > 0 ? (completedModulesCount / totalModules) * 100 : 0;

  // Módulos disponíveis para continuar
  const availableModules = modules.filter(module => 
    !user?.completedModules?.includes(module.id)
  ).slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Profile Header - Estilo Facebook */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200/50"
      >
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-4 left-6 flex items-end space-x-6">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&size=160`}
                alt={user?.displayName}
                className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg object-cover"
              />
              {/* Instituto Badge */}
              {institutConfig && (
                <div className={`absolute -bottom-2 -right-2 w-10 h-10 ${institutConfig.color} rounded-xl flex items-center justify-center border-4 border-white`}>
                  <span className="text-white font-bold text-xs">
                    {institutConfig.name.slice(0, 2)}
                  </span>
                </div>
              )}
            </div>
            
            {/* User Info */}
            <div className="pb-4 text-white">
              <h1 className="text-3xl font-bold mb-1">{user?.displayName}</h1>
              <p className="text-white/90 mb-1">{user?.profession} • {institutConfig?.fullName}</p>
              {user?.bio && (
                <p className="text-white/80 text-sm max-w-md">{user.bio}</p>
              )}
              <div className="flex items-center space-x-4 mt-2 text-sm text-white/80">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Membro desde {new Date(user?.createdAt || 0).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="px-6 py-4 bg-gray-50/50">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{user?.points || 0}</div>
              <div className="text-xs text-gray-500">Pontos Totais</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">#{user?.currentRank || 0}</div>
              <div className="text-xs text-gray-500">Ranking Geral</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">#{user?.instituteRank || 0}</div>
              <div className="text-xs text-gray-500">No Instituto</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{user?.badges?.length || 0}</div>
              <div className="text-xs text-gray-500">Badges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{completedModulesCount}/{totalModules}</div>
              <div className="text-xs text-gray-500">Módulos</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions & Progress */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Progress Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Seu Progresso</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Completado</span>
                <span className="font-bold">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
            
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                {totalModules - completedModulesCount} módulos restantes
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Conquistas</h3>
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Badges Coletados</span>
              <span className="font-bold text-yellow-600">{user?.badges?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Certificados</span>
              <span className="font-bold text-blue-600">{user?.certificates?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Horas de Estudo</span>
              <span className="font-bold text-green-600">
                {Math.round((completedModulesCount * 15) / 60)}h
              </span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Ações Rápidas</h3>
            <Sparkles className="w-5 h-5 text-purple-500" />
          </div>
          
          <div className="space-y-3">
            <Link 
              to="/ranking"
              className="block w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-center"
            >
              <span className="text-blue-700 font-medium">Ver Ranking</span>
            </Link>
            <Link 
              to="/certificates"
              className="block w-full p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-center"
            >
              <span className="text-green-700 font-medium">Certificados</span>
            </Link>
            <Link 
              to="/profile"
              className="block w-full p-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-center"
            >
              <span className="text-purple-700 font-medium">Editar Perfil</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Módulos Disponíveis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Continue Aprendendo</h2>
          <Link to="/modules" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
            Ver todos <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableModules.map((module) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * module.order }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <Link to={`/modules/${module.id}`}>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-300">
                    
                    {/* Card Header */}
                    <div className="h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 p-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full font-medium">
                            Módulo {module.order}
                          </span>
                        </div>
                        <h3 className="text-white font-bold text-lg leading-tight">
                          {module.title}
                        </h3>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {module.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{module.estimatedMinutes} min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Award className="w-3 h-3" />
                            <span>{module.points} pts</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 font-medium group-hover:text-blue-700">
                          Iniciar Módulo
                        </span>
                        <div className="w-10 h-10 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center transition-colors">
                          <Play className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
