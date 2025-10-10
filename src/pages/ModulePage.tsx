// ARQUIVO: src/pages/ModulePage.tsx
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuthStore } from '../stores/authStore';
import { type Module } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ArrowLeft, CheckCircle, PlayCircle } from 'lucide-react';

interface ContentItem { id: string; order: number; title: string; type: 'text'; content: string; }

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [module, setModule] = useState<Module | null>(null);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModuleData = async () => {
      if (!moduleId) return;
      setIsLoading(true);
      try {
        const moduleRef = doc(db, 'modules', moduleId);
        const moduleSnap = await getDoc(moduleRef);
        
        if (moduleSnap.exists()) {
          setModule({ id: moduleSnap.id, ...moduleSnap.data() } as Module);
          const contentQuery = query(collection(moduleRef, 'content'), orderBy('order'));
          const contentSnapshot = await getDocs(contentQuery);
          setContent(contentSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as ContentItem[]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchModuleData();
  }, [moduleId]);

  if (isLoading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;
  if (!module) return <div className="text-center py-20">Módulo não encontrado.</div>;

  const isCompleted = user?.completedModules?.includes(module.id);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link to="/modules" className="flex items-center text-gray-500 hover:text-gray-900 font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar para a Trilha
      </Link>
      <div className="card-elevated">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{module.title}</h1>
        <p className="text-lg text-gray-600">{module.description}</p>
        <hr className="my-8" />
        
        <div className="prose prose-lg max-w-none">
          {content.length > 0 ? (
            content.map(item => (
              <div key={item.id} className="mb-8">
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.content.replace(/\n/g, '<br />') }} />
              </div>
            ))
          ) : (
            <p>O conteúdo deste módulo está sendo preparado.</p>
          )}
        </div>
        
        <div className="mt-12 text-center">
          {isCompleted ? (
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 font-semibold px-6 py-3 rounded-xl">
              <CheckCircle className="w-6 h-6" />
              <span>Módulo Concluído!</span>
            </div>
          ) : (
            <button onClick={() => navigate(`/modules/${moduleId}/quiz`)} className="btn-primary flex items-center gap-2 mx-auto">
              <PlayCircle className="w-5 h-5" />
              Realizar Quiz para Concluir
            </button>
          )}
        </div>
      </div>
    </div>
  );
}