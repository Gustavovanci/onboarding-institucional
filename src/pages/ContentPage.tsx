// src/pages/ContentPage.tsx
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { FileText, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion'; // <-- IMPORTANTE

interface PageData {
  title: string;
  content: string;
}

interface ContentPageProps {
  pageId: string;
}

export default function ContentPage({ pageId }: ContentPageProps) {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setPageData(null);
      setError(null);
      
      try {
        const docRef = doc(db, 'content', pageId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPageData(docSnap.data() as PageData);
        } else {
          setError('Conteúdo não encontrado.');
        }
      } catch (err) {
        console.error("Erro ao buscar conteúdo:", err);
        setError('Não foi possível carregar o conteúdo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [pageId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <p className="text-gray-500 animate-pulse">Carregando conteúdo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Ops! Algo deu errado</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
      {/* Header com gradiente */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-green-500/20"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="h-8 w-px bg-white/30"></div>
            <span className="text-white/80 font-medium">Módulo de Integração</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">{pageData?.title}</h1>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="bg-white rounded-3xl shadow-xl shadow-blue-500/10 overflow-hidden">
        <div className="p-8 md:p-12">
          <article className="prose prose-lg max-w-none prose-h2:text-brand-secondary prose-h2:font-bold prose-strong:text-gray-800 prose-a:text-blue-600 hover:prose-a:text-blue-800">
            <div dangerouslySetInnerHTML={{ __html: pageData?.content.replace(/\n/g, '<p>') || '' }} />
          </article>
        </div>
        <div className="h-2 bg-gradient-to-r from-blue-500 via-green-500 to-orange-400"></div>
      </div>
    </motion.div>
  );
}