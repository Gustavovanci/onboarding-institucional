import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Sparkles, Heart, Star, MessageCircle } from 'lucide-react';

interface FeedbackMessage {
  message: string;
}

// Stop words expandidas
const stopWords = new Set([
  'a', 'o', 'e', 'ou', 'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na',
  'um', 'uma', 'com', 'por', 'para', 'que', 'se', 'ser', 'foi', 'muito',
  'é', 'são', 'como', 'eu', 'você', 'ele', 'nós', 'mas', 'bem', 'bom',
  'ótimo', 'excelente', 'parabéns', 'obrigado', 'obrigada', 'continue',
  'sucesso', 'seja', 'bem-vindo', 'bem-vinda', 'aqui', 'hc', 'já', 'mais',
  'vai', 'ter', 'tem', 'seu', 'sua', 'aos', 'às', 'pelo', 'pela', 'isso',
  'essa', 'esse', 'esses', 'essas', 'este', 'esta', 'aqui', 'ali', 'lá' ,'vindo','vinda',
  'cada' , 'ruim' , 'péssimo' , 'mal' , 'mau' , 'HC' , 'ódio' , 'tristeza' , 'triste' , 'caralho' , 'porra' , 'filho' , 
  'filha' , 'filha-da-puta' , 'pau' , 'pênis' , 'viado' , 'gay' , 'vagabundo' , 'vagabunda' , 'piranha' , 
  'bicha' , 'vaca' , 'link' , 'site' , 'i' , 'e' , 
]);

// Paleta de cores vibrantes
const colorPalette = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
  '#E63946', '#F77F00', '#06FFA5', '#4361EE', '#F72585',
  '#7209B7', '#3A86FF', '#FB5607', '#FF006E', '#8338EC'
];

interface Word {
  text: string;
  value: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  fontSize: number;
}

const WordCloud = ({ messages }: { messages: FeedbackMessage[] }) => {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  const words = useMemo(() => {
    const wordCounts: { [key: string]: number } = {};

    // Conta as palavras
    messages.forEach(msg => {
      if (msg.message) {
        msg.message
          .toLowerCase()
          .replace(/[^a-zà-ú\s]/g, '')
          .split(/\s+/)
          .forEach(word => {
            if (word.length > 3 && !stopWords.has(word)) {
              wordCounts[word] = (wordCounts[word] || 0) + 1;
            }
          });
      }
    });

    const sortedWords = Object.entries(wordCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 60);

    if (sortedWords.length === 0) return [];

    const maxValue = sortedWords[0][1];
    const minValue = sortedWords[sortedWords.length - 1][1];

    // Cria grid virtual para posicionamento
    const cols = 8;
    const rows = Math.ceil(sortedWords.length / cols);
    
    return sortedWords.map(([text, value], index) => {
      const normalizedValue = (value - minValue) / (maxValue - minValue || 1);
      
      // Calcula posição base no grid
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      // Adiciona variação aleatória mas controlada
      const baseX = (col / cols) * 90 + 5;
      const baseY = (row / rows) * 90 + 5;
      const randomX = (Math.random() - 0.5) * 8;
      const randomY = (Math.random() - 0.5) * 8;
      
      // Tamanho proporcional à frequência
      const minSize = 14;
      const maxSize = 56;
      const fontSize = minSize + (maxSize - minSize) * normalizedValue;
      
      return {
        text,
        value,
        x: baseX + randomX,
        y: baseY + randomY,
        rotation: (Math.random() - 0.5) * 15,
        color: colorPalette[index % colorPalette.length],
        fontSize
      };
    });
  }, [messages]);

  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center px-4">
        <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-xl text-gray-500 font-medium">Ainda não há mensagens suficientes</p>
        <p className="text-gray-400 mt-2">As palavras mais inspiradoras aparecerão aqui em breve!</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl overflow-hidden">
      {/* Textura de fundo estilo mural */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      {/* Elementos decorativos flutuantes */}
      <motion.div
        className="absolute top-10 right-10"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Sparkles className="w-8 h-8 text-yellow-400 opacity-40" />
      </motion.div>
      
      <motion.div
        className="absolute bottom-10 left-10"
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -10, 0]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Heart className="w-8 h-8 text-pink-400 opacity-40" />
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-5"
        animate={{ 
          x: [0, 15, 0],
          rotate: [0, 15, 0]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Star className="w-6 h-6 text-blue-400 opacity-30" />
      </motion.div>

      {/* Nuvem de palavras */}
      <div className="relative w-full h-full p-8">
        <AnimatePresence>
          {words.map(({ text, value, x, y, rotation, color, fontSize }, index) => (
            <motion.div
              key={text}
              initial={{ 
                opacity: 0, 
                scale: 0,
                rotate: rotation + 180
              }}
              animate={{ 
                opacity: hoveredWord === text ? 1 : 0.85, 
                scale: hoveredWord === text ? 1.15 : 1,
                rotate: rotation
              }}
              transition={{ 
                duration: 0.6,
                delay: index * 0.03,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.2,
                rotate: 0,
                zIndex: 50,
                transition: { duration: 0.2 }
              }}
              onHoverStart={() => setHoveredWord(text)}
              onHoverEnd={() => setHoveredWord(null)}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                fontSize: `${fontSize}px`,
                color: color,
                fontWeight: 700,
                textShadow: hoveredWord === text 
                  ? '0 4px 12px rgba(0,0,0,0.15)' 
                  : '0 2px 4px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                transform: 'translate(-50%, -50%)',
                filter: hoveredWord === text ? 'brightness(1.1)' : 'brightness(1)',
              }}
              className="font-black transition-all duration-200"
            >
              <motion.span
                className="relative inline-block"
                whileHover={{
                  y: -5,
                }}
              >
                {text}
                {/* Tooltip com frequência */}
                {hoveredWord === text && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap font-medium shadow-lg"
                    style={{ fontSize: '12px' }}
                  >
                    {value} {value === 1 ? 'menção' : 'menções'}
                  </motion.div>
                )}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Contador de palavras */}
      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
        <p className="text-sm font-semibold text-gray-700">
          <span className="text-indigo-600">{words.length}</span> palavras únicas
        </p>
      </div>
    </div>
  );
};

// Componente principal - integração com Firebase
export default function MessagesPage() {
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        // Importar Firebase aqui - ajuste o caminho conforme sua estrutura
        const { collection, getDocs, query, orderBy, limit } = await import('firebase/firestore');
        const { db } = await import('../utils/firebase');
        
        const q = query(
          collection(db, 'feedback'),
          orderBy('createdAt', 'desc'),
          limit(200)
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div 
            className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Cloud className="w-10 h-10 text-white" strokeWidth={2.5} />
          </motion.div>
          
          <h1 className="text-5xl font-black text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Mural de Ideias
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            As palavras mais inspiradoras deixadas pelos colaboradores para os novos colegas.
            <br />
            <span className="text-sm text-indigo-600 font-medium">
              Passe o mouse sobre as palavras para ver quantas vezes foram mencionadas
            </span>
          </p>
        </motion.div>

        {/* Word Cloud Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-96">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Cloud className="w-12 h-12 text-indigo-500" />
              </motion.div>
              <p className="mt-4 text-gray-500 font-medium">Carregando mensagens...</p>
            </div>
          ) : (
            <WordCloud messages={messages} />
          )}
        </motion.div>

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
            <div className="text-3xl font-black text-indigo-600">{messages.length}</div>
            <div className="text-sm text-gray-600 font-medium mt-1">Mensagens Recebidas</div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
            <div className="text-3xl font-black text-purple-600">
              {messages.reduce((acc, msg) => acc + msg.message.split(' ').length, 0)}
            </div>
            <div className="text-sm text-gray-600 font-medium mt-1">Palavras Compartilhadas</div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
            <div className="text-3xl font-black text-pink-600">100%</div>
            <div className="text-sm text-gray-600 font-medium mt-1">Inspiração e Energia</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}