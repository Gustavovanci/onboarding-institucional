// src/pages/DashboardPage.tsx
import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

interface Module {
  id: string;
  title: string;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const q = query(collection(db, "content"), orderBy("order"));
        const querySnapshot = await getDocs(q);
        const modulesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
        }));
        setModules(modulesList);
      } catch (error) {
        console.error("Erro ao buscar módulos: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModules();
  }, []);

  return (
    <div className="space-y-8">
      <div className="card bg-brand-primary text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Seja bem-vindo(a), {user?.displayName?.split(' ')[0]}!
        </h1>
        <p className="text-white/80">
          Siga os módulos abaixo para completar sua integração institucional.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-brand-dark mb-4">Trilha de Aprendizagem</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-48"><LoadingSpinner /></div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((module) => (
              <Link
                to={`/${module.id === 'boas-vindas' ? '' : module.id}`} // O primeiro vai para a raiz
                key={module.id}
                className="card flex justify-between items-center hover:shadow-xl hover:border-brand-primary transition-all duration-300"
              >
                <div>
                  <h3 className="text-lg font-bold text-brand-secondary">{module.title}</h3>
                  <p className="text-sm text-gray-500">Módulo institucional</p>
                </div>
                <ArrowRight className="h-6 w-6 text-brand-primary" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}