// src/pages/MessagesPage.tsx
import { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Cloud } from 'lucide-react';

interface FeedbackMessage {
  message: string;
}

// Lista de palavras comuns a serem ignoradas na nuvem de palavras
const stopWords = new Set([
  'a', 'o', 'e', 'ou', 'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na',
  'um', 'uma', 'com', 'por', 'para', 'que', 'se', 'ser', 'foi', 'muito',
  'é', 'são', 'como', 'eu', 'você', 'ele', 'nós', 'mas', 'bem', 'bom',
  'ótimo', 'excelente', 'parabéns', 'obrigado', 'obrigada', 'continue',
  'sucesso', 'seja', 'bem-vindo', 'bem-vinda', 'aqui', 'hc'
]);

const WordCloud = ({ messages }: { messages: FeedbackMessage[] }) => {
  const words = useMemo(() => {
    const wordCounts: { [key: string]: number } = {};

    messages.forEach(msg => {
      if (msg.message) {
        msg.message
          .toLowerCase()
          .replace(/[^a-zà-ú\s]/g, '') // Remove pontuação e caracteres especiais
          .split(/\s+/)
          .forEach(word => {
            if (word.length > 2 && !stopWords.has(word)) {
              wordCounts[word] = (wordCounts[word] || 0) + 1;
            }
          });
      }
    });

    return Object.entries(wordCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 50) // Limita a 50 palavras
      .map(([text, value]) => ({ text, value }));
  }, [messages]);

  if (words.length === 0) {
    return <p className="text-gray-500">Ainda não há mensagens suficientes para gerar a nuvem de palavras.</p>;
  }

  // Função para determinar o tamanho da fonte com base na frequência
  const getFontSize = (value: number, max: number) => {
    const minSize = 16; // 1rem
    const maxSize = 64; // 4rem
    return minSize + (maxSize - minSize) * (value / max);
  };

  const maxValue = words.length > 0 ? words[0].value : 1;

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 p-8">
      {words.map(({ text, value }) => (
        <motion.span
          key={text}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: Math.random() * 0.5 }}
          style={{ fontSize: `${getFontSize(value, maxValue)}px` }}
          className="font-bold text-gray-700 hover:text-brand-azure transition-colors"
        >
          {text}
        </motion.span>
      ))}
    </div>
  );
};

export default function MessagesPage () {
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const q = query(
          collection(db, 'feedback'),
          orderBy('createdAt', 'desc'),
          limit(200) // Busca as últimas 200 mensagens
        );
        const querySnapshot = await getDocs(q);
        const fetchedMessages = querySnapshot.docs.map(doc => doc.data() as FeedbackMessage);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Erro ao buscar mensagens de feedback:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Cloud className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900">Mural de Mensagens</h1>
        <p className="mt-2 text-lg text-gray-600">Uma nuvem de palavras com as mensagens deixadas pelos colaboradores para os novos colegas.</p>
      </motion.div>
      <div className="card-elevated">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <WordCloud messages={messages} />
        )}
      </div>
    </div>
  );
}