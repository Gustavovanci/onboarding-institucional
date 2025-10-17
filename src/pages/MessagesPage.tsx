import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, MessageCircle, TrendingUp, Users, Sparkles } from 'lucide-react';

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
  'bicha' , 'vaca' , 'link' , 'site' , 'i' , 'e' , 'vagina' , 'cu' , 'bunda' , 'buceta', 'odio', 'odeio' , 'odeia', 
  'chato', 'horrível', 'horrivel', 'feio' , 'feia', 'pessimo', 'u', 'y', 'ti', 'tua', 'teu', 'vai-corinthians', 'corinthians', 'curinthians',
  'vaicurunthinas', 'vaicorinthians', 'timão', 'bando', 'oi', 'tchau', 'bye', 'bye-bye', 'fudeu', 'fodeo', 'corno', 'corna', 'presta', 'demonio', 'demonia', 'diabo', 'cão',
  'chato', 'pior', 'triste'
]);

// Cores HC
const colorPalette = [
  '#00AEEF', '#004C7E', '#0072BC', '#006B4E', '#009E73', '#F15A29',
  '#2B97D4', '#20856B', '#136D5E', '#0D4E48', '#237450', '#1E5A3E'
];

// Algoritmo de posicionamento estático MELHORADO - zero sobreposição
function generateStaticLayout(words, containerWidth = 1000, containerHeight = 600) {
  const positions = [];
  const padding = 12; // Aumentado para garantir espaçamento
  const maxAttempts = 500; // Mais tentativas para encontrar posição

  const checkOverlap = (newWord, existingWords) => {
    for (const existing of existingWords) {
      const dx = Math.abs(newWord.x - existing.x);
      const dy = Math.abs(newWord.y - existing.y);
      const minDistX = (newWord.width + existing.width) / 2 + padding;
      const minDistY = (newWord.height + existing.height) / 2 + padding;
      
      if (dx < minDistX && dy < minDistY) {
        return true;
      }
    }
    return false;
  };

  // Ordenar palavras por tamanho (maiores primeiro) para melhor distribuição
  const sortedWords = [...words].sort((a, b) => b.fontSize - a.fontSize);

  sortedWords.forEach((word, index) => {
    let placed = false;
    let attempts = 0;
    
    // Múltiplas estratégias de posicionamento
    while (!placed && attempts < maxAttempts) {
      let x, y;
      
      if (attempts < 50) {
        // Estratégia 1: Espiral a partir do centro
        const angle = index * 2.4 + (attempts * 0.8);
        const radius = 40 + index * 12 + (attempts * 3);
        x = containerWidth / 2 + Math.cos(angle) * radius;
        y = containerHeight / 2 + Math.sin(angle) * radius;
      } else if (attempts < 150) {
        // Estratégia 2: Grid com offset aleatório
        const gridSize = Math.ceil(Math.sqrt(sortedWords.length));
        const gridX = (index % gridSize) / gridSize;
        const gridY = Math.floor(index / gridSize) / gridSize;
        const offsetX = (Math.random() - 0.5) * 100;
        const offsetY = (Math.random() - 0.5) * 100;
        x = gridX * containerWidth + offsetX;
        y = gridY * containerHeight + offsetY;
      } else {
        // Estratégia 3: Posicionamento aleatório puro
        x = Math.random() * containerWidth;
        y = Math.random() * containerHeight;
      }
      
      // Garantir que a palavra fique dentro dos limites
      const wordObj = {
        ...word,
        x: Math.max(word.width / 2 + padding, Math.min(containerWidth - word.width / 2 - padding, x)),
        y: Math.max(word.height / 2 + padding, Math.min(containerHeight - word.height / 2 - padding, y)),
      };
      
      if (!checkOverlap(wordObj, positions)) {
        positions.push(wordObj);
        placed = true;
      }
      
      attempts++;
    }
    
    // Última tentativa: coloca em áreas menos densas
    if (!placed) {
      const sectors = 8;
      for (let sector = 0; sector < sectors; sector++) {
        const angle = (sector / sectors) * Math.PI * 2;
        const radius = 150 + Math.random() * 100;
        const x = containerWidth / 2 + Math.cos(angle) * radius;
        const y = containerHeight / 2 + Math.sin(angle) * radius;
        
        const wordObj = {
          ...word,
          x: Math.max(word.width / 2 + padding, Math.min(containerWidth - word.width / 2 - padding, x)),
          y: Math.max(word.height / 2 + padding, Math.min(containerHeight - word.height / 2 - padding, y)),
        };
        
        if (!checkOverlap(wordObj, positions)) {
          positions.push(wordObj);
          placed = true;
          break;
        }
      }
    }
  });

  return positions;
}

export default function WordCloudPage() {
  const [hoveredWord, setHoveredWord] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Buscar mensagens reais do Firebase
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        // Importar Firebase
        const { collection, getDocs, query, where, orderBy, limit } = await import('firebase/firestore');
        const { db } = await import('../utils/firebase');
        
        // Filtrar mensagens dos últimos 10 dias
        const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
        
        const q = query(
          collection(db, 'feedback'),
          where('createdAt', '>=', tenDaysAgo),
          orderBy('createdAt', 'desc'),
          limit(200)
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedMessages = querySnapshot.docs.map(doc => ({
          message: doc.data().message,
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Erro ao buscar mensagens de feedback:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, []);

  const wordData = useMemo(() => {
    if (messages.length === 0) return [];

    const wordCounts = {};

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
      .slice(0, 50);

    if (sortedWords.length === 0) return [];

    const maxValue = sortedWords[0][1];
    const minValue = sortedWords[sortedWords.length - 1][1];

    const words = sortedWords.map(([text, value], index) => {
      const normalizedValue = (value - minValue) / (maxValue - minValue || 1);
      const minSize = 18;
      const maxSize = 68;
      const fontSize = minSize + (maxSize - minSize) * normalizedValue;
      
      // Estima largura e altura com margem extra para evitar sobreposição
      const charWidth = fontSize * 0.65;
      const width = text.length * charWidth + 10; // +10 px de margem
      const height = fontSize * 1.5 + 10; // +10 px de margem

      return {
        text,
        value,
        fontSize,
        width,
        height,
        color: colorPalette[index % colorPalette.length],
      };
    });

    return generateStaticLayout(words);
  }, [messages]);

  if (wordData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F0F4F8] via-white to-[#F0F4F8] flex items-center justify-center p-6">
        <div className="text-center">
          <MessageCircle className="w-20 h-20 text-[#00AEEF] mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-[#004C7E] mb-2">Nenhuma mensagem ainda</h2>
          <p className="text-gray-500">As palavras inspiradoras aparecerão aqui em breve!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F4F8] via-white to-[#E8F4F8] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-[#00AEEF] to-[#0072BC] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Cloud className="w-10 h-10 text-white" strokeWidth={2.5} />
          </motion.div>

          <h1 className="text-5xl font-black bg-gradient-to-r from-[#004C7E] to-[#0072BC] bg-clip-text text-transparent mb-3">
            Mural de Inspiração
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
            Palavras mais marcantes compartilhadas pelos colaboradores
          </p>
          
          <p className="text-sm text-[#00AEEF] font-medium">
            Passe o mouse sobre as palavras para ver detalhes
          </p>
        </motion.div>

        {/* Word Cloud Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden"
        >
          {/* Decorative background */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #004C7E 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />

          {/* Floating decorations */}
          <motion.div
            className="absolute top-8 right-8 text-[#00AEEF] opacity-20"
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles size={40} />
          </motion.div>

          {/* Word Cloud SVG */}
          <div className="relative" style={{ height: '600px' }}>
            <svg width="100%" height="600" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
              <AnimatePresence>
                {wordData.map((word, index) => (
                  <motion.g
                    key={word.text}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: hoveredWord === word.text ? 1 : 0.85,
                      scale: hoveredWord === word.text ? 1.15 : 1
                    }}
                    transition={{ 
                      duration: 0.5,
                      delay: index * 0.02
                    }}
                    onMouseEnter={() => setHoveredWord(word.text)}
                    onMouseLeave={() => setHoveredWord(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <text
                      x={word.x}
                      y={word.y}
                      fontSize={word.fontSize}
                      fontWeight="700"
                      fill={word.color}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        filter: hoveredWord === word.text 
                          ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' 
                          : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {word.text}
                    </text>
                    
                    {hoveredWord === word.text && (
                      <motion.g
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <rect
                          x={word.x - 50}
                          y={word.y + word.fontSize / 2 + 15}
                          width="100"
                          height="30"
                          rx="15"
                          fill="#004C7E"
                        />
                        <text
                          x={word.x}
                          y={word.y + word.fontSize / 2 + 30}
                          fontSize="14"
                          fontWeight="600"
                          fill="white"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {word.value} {word.value === 1 ? 'vez' : 'vezes'}
                        </text>
                      </motion.g>
                    )}
                  </motion.g>
                ))}
              </AnimatePresence>
            </svg>
          </div>

          {/* Word count badge */}
          <div className="absolute bottom-6 right-6 bg-gradient-to-r from-[#00AEEF] to-[#0072BC] text-white px-6 py-3 rounded-full shadow-lg">
            <p className="text-sm font-bold">
              {wordData.length} palavras únicas
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-gradient-to-br from-[#00AEEF]/10 to-[#0072BC]/10 rounded-2xl p-6 text-center backdrop-blur-sm border border-[#00AEEF]/20">
            <MessageCircle className="w-8 h-8 text-[#00AEEF] mx-auto mb-3" />
            <div className="text-3xl font-black text-[#004C7E]">{messages.length}</div>
            <div className="text-sm text-gray-600 font-semibold mt-1">Mensagens Recebidas</div>
          </div>

          <div className="bg-gradient-to-br from-[#009E73]/10 to-[#006B4E]/10 rounded-2xl p-6 text-center backdrop-blur-sm border border-[#009E73]/20">
            <TrendingUp className="w-8 h-8 text-[#009E73] mx-auto mb-3" />
            <div className="text-3xl font-black text-[#006B4E]">
              {messages.reduce((acc, msg) => acc + (msg.message ? msg.message.split(' ').length : 0), 0)}
            </div>
            <div className="text-sm text-gray-600 font-semibold mt-1">Palavras Compartilhadas</div>
          </div>

          <div className="bg-gradient-to-br from-[#F15A29]/10 to-[#F15A29]/20 rounded-2xl p-6 text-center backdrop-blur-sm border border-[#F15A29]/20">
            <Users className="w-8 h-8 text-[#F15A29] mx-auto mb-3" />
            <div className="text-3xl font-black text-[#F15A29]">100%</div>
            <div className="text-sm text-gray-600 font-semibold mt-1">Energia Positiva</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}