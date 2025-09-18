// src/pages/ContentPage.tsx
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import LoadingSpinner from '../components/LoadingSpinner';

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
      setPageData(null); // Limpa o estado anterior
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
    return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="card bg-red-50 text-red-700">{error}</div>;
  }

  return (
    <div className="card prose lg:prose-lg max-w-none bg-white p-8 lg:p-12 shadow-lg">
      <h1 className="text-brand-secondary">{pageData?.title}</h1>
      <div 
        className="text-gray-700"
        dangerouslySetInnerHTML={{ __html: pageData?.content.replace(/\n/g, '<br />') || '' }} 
      />
    </div>
  );
}