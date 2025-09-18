import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuthStore } from '../stores/authStore';
import { useProgressStore } from '../stores/progressStore'; // Caminho corrigido após renomear
import { type Module } from '../types'; // Importando do arquivo de tipos central
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const ModulePage = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user } = useAuthStore();
  const { completeModule, isLoading: isProgressLoading } = useProgressStore();

  const [module, setModule] = useState<Module | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModule = async () => {
      if (!moduleId) return;
      setIsLoading(true);
      const docRef = doc(db, 'modules', moduleId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setModule({ id: docSnap.id, ...docSnap.data() } as Module);
      }
      setIsLoading(false);
    };
    fetchModule();
  }, [moduleId]);

  // A verificação de user?.completedModules precisa de um tipo User completo
  const userProfile = useAuthStore(state => state.user);
  const isCompleted = userProfile?.completedModules?.includes(moduleId || '');

  const handleCompleteModule = () => {
    if (user && module && !isCompleted) {
      // Passando os dados corretos para a função
      completeModule(user.uid, { id: module.id, points: module.points, isRequired: true }); // Assumindo que isRequired é true
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><LoadingSpinner /></div>;
  }

  if (!module) {
    return <div className="text-center py-20">Módulo não encontrado.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link to="/dashboard" className="flex items-center text-gray-500 hover:text-gray-900 font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar para a Trilha
      </Link>
      
      <div className="card-elevated">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{module.title}</h1>
        <p className="text-lg text-gray-600">{module.description}</p>
        <hr className="my-8" />
        
        <div className="prose prose-lg max-w-none">
          {module.content.map(item => (
            <div key={item.id} className="mb-6">
              <h3 className="font-semibold">{item.title}</h3>
              <p>{item.content}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
            {isCompleted ? (
                <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 font-semibold px-6 py-3 rounded-xl">
                    <CheckCircle className="w-6 h-6" />
                    <span>Módulo Concluído!</span>
                </div>
            ) : (
                <button 
                    onClick={handleCompleteModule} 
                    disabled={isProgressLoading}
                    className="btn-primary"
                >
                    {isProgressLoading ? 'Salvando...' : `Concluir Módulo (+${module.points} pts)`}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ModulePage;