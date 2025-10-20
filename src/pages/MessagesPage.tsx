import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Cloud, MessageCircle, TrendingUp, Users } from 'lucide-react';

const stopWords = new Set([
  'a', 'o', 'e', 'ou', 'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na',
  'um', 'uma', 'com', 'por', 'para', 'que', 'se', 'ser', 'foi', 'muito',
  'é', 'são', 'como', 'eu', 'você', 'ele', 'nós', 'mas', 'bem', 'bom',
  'ótimo', 'excelente', 'parabéns', 'obrigado', 'obrigada', 'continue',
  'sucesso', 'seja', 'bem-vindo', 'bem-vinda', 'aqui', 'hc', 'já', 'mais',
  'vai', 'ter', 'tem', 'seu', 'sua', 'aos', 'às', 'pelo', 'pela', 'isso',
  'essa', 'esse', 'esses', 'essas', 'este', 'esta', 'aqui', 'ali', 'lá', 'vindo', 'vinda',
  'cada', 'ruim', 'péssimo', 'mal', 'mau', 'HC', 'ódio', 'tristeza', 'triste', 'caralho', 'porra', 'filho',
  'filha', 'filha-da-puta', 'pau', 'pênis', 'viado', 'gay', 'vagabundo', 'vagabunda', 'piranha',
  'bicha', 'vaca', 'link', 'site', 'i', 'e', 'vagina', 'cu', 'bunda', 'buceta', 'odio', 'odeio', 'odeia',
  'chato', 'horrível', 'horrivel', 'feio', 'feia', 'pessimo', 'u', 'y', 'ti', 'tua', 'teu', 'vai-corinthians', 'corinthians', 'curinthians',
  'vaicurunthinas', 'vaicorinthians', 'timão', 'bando', 'oi', 'tchau', 'bye', 'bye-bye', 'fudeu', 'fodeo', 'corno', 'corna', 'presta', 'demonio', 'demonia', 'diabo', 'cão',
  'chato', 'pior', 'triste'
]);

// Cores inspiradas no anexo - vibrantes e modernas
const colorPalette = [
  '#00AEEF', // Azul claro
  '#F15A29', // Laranja
  '#009E73', // Verde
  '#0072BC', // Azul médio
  '#E74C3C', // Vermelho
  '#3498DB', // Azul royal
  '#2ECC71', // Verde claro
  '#9B59B6', // Roxo
  '#F39C12', // Amarelo
  '#1ABC9C', // Turquesa
  '#E67E22', // Laranja escuro
  '#34495E'  // Cinza azulado
];

// Algoritmo de posicionamento estático - zero sobreposição
function generateStaticLayout(words, containerWidth = 1200, containerHeight = 700) {
  const positions = [];
  const padding = 20;
  const maxAttempts = 800;

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

  const sortedWords = [...words].sort((a, b) => b.fontSize - a.fontSize);

  sortedWords.forEach((word, index) => {
    let placed = false;
    let attempts = 0;
    
    while (!placed && attempts < maxAttempts) {
      let x, y;
      
      if (attempts < 100) {
        // Espiral do centro
        const angle = index * 2.2 + (attempts * 0.5);
        const radius = 60 + index * 15 + (attempts * 2.5);
        x = containerWidth / 2 + Math.cos(angle) * radius;
        y = containerHeight / 2 + Math.sin(angle) * radius;
      } else if (attempts < 300) {
        // Grid com variação
        const gridSize = Math.ceil(Math.sqrt(sortedWords.length));
        const gridX = (index % gridSize) / gridSize;
        const gridY = Math.floor(index / gridSize) / gridSize;
        const offsetX = (Math.random() - 0.5) * 120;
        const offsetY = (Math.random() - 0.5) * 120;
        x = gridX * containerWidth + offsetX;
        y = gridY * containerHeight + offsetY;
      } else {
        // Aleatório
        x = Math.random() * containerWidth;
        y = Math.random() * containerHeight;
      }
      
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
    
    // Fallback: setores radiais
    if (!placed) {
      const sectors = 12;
      for (let sector = 0; sector < sectors; sector++) {
        const angle = (sector / sectors) * Math.PI * 2;
        const radius = 180 + Math.random() * 150;
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
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 700 });

  // Atualizar dimensões responsivas
  useEffect(() => {
    const updateDimensions = () => {
      const width = Math.min(window.innerWidth - 100, 1400);
      const height = Math.max(window.innerHeight * 0.6, 500);
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

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
      .slice(0, 60);

    if (sortedWords.length === 0) return [];

    const maxValue = sortedWords[0][1];
    const minValue = sortedWords[sortedWords.length - 1][1];

    const words = sortedWords.map(([text, value], index) => {
      const normalizedValue = (value - minValue) / (maxValue - minValue || 1);
      const minSize = 22;
      const maxSize = 85;
      const fontSize = minSize + (maxSize - minSize) * normalizedValue;
      
      const charWidth = fontSize * 0.68;
      const width = text.length * charWidth + 15;
      const height = fontSize * 1.6 + 15;

      return {
        text,
        value,
        fontSize,
        width,
        height,
        color: colorPalette[index % colorPalette.length],
      };
    });

    return generateStaticLayout(words, dimensions.width, dimensions.height);
  }, [messages, dimensions]);

  if (wordData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
        <div className="text-center">
          <MessageCircle className="w-20 h-20 text-[#00AEEF] mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-[#0072BC] mb-2">Nenhuma mensagem ainda</h2>
          <p className="text-gray-500">As palavras inspiradoras aparecerão aqui em breve!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#00AEEF] to-[#0072BC] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Cloud className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2.5} />
          </motion.div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-[#00AEEF] via-[#0072BC] to-[#009E73] bg-clip-text text-transparent mb-3">
            Mural de Palavras
          </h1>

          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            As palavras mais marcantes dos nossos colaboradores
          </p>
        </motion.div>

        {/* Word Cloud Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl p-4 md:p-8 relative overflow-hidden"
        >
          {/* Decorative background pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]" 
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #00AEEF 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} 
          />

          {/* Word Cloud SVG - Responsivo */}
          <div className="relative w-full" style={{ minHeight: '500px' }}>
            <svg 
              width="100%" 
              height="100%" 
              viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
              preserveAspectRatio="xMidYMid meet"
              style={{ maxHeight: '80vh' }}
            >
              {wordData.map((word, index) => (
                <motion.text
                  key={word.text}
                  x={word.x}
                  y={word.y}
                  fontSize={word.fontSize}
                  fontWeight="800"
                  fill={word.color}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.9, scale: 1 }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.015,
                    ease: "easeOut"
                  }}
                  style={{
                    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {word.text}
                </motion.text>
              ))}
            </svg>
          </div>

          {/* Contador de palavras */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-gradient-to-r from-[#00AEEF] to-[#009E73] text-white px-4 py-2 md:px-6 md:py-3 rounded-full shadow-xl"
          >
            <p className="text-xs md:text-sm font-bold">
              {wordData.length} palavras
            </p>
          </motion.div>
        </motion.div>

        {/* Stats Cards - Responsivo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          <div className="bg-gradient-to-br from-[#00AEEF]/10 to-[#0072BC]/10 rounded-2xl p-6 text-center backdrop-blur-sm border border-[#00AEEF]/20 shadow-lg">
            <MessageCircle className="w-8 h-8 text-[#00AEEF] mx-auto mb-3" />
            <div className="text-3xl md:text-4xl font-black text-[#0072BC]">{messages.length}</div>
            <div className="text-sm text-gray-600 font-semibold mt-1">Mensagens</div>
          </div>

          <div className="bg-gradient-to-br from-[#009E73]/10 to-[#006B4E]/10 rounded-2xl p-6 text-center backdrop-blur-sm border border-[#009E73]/20 shadow-lg">
            <TrendingUp className="w-8 h-8 text-[#009E73] mx-auto mb-3" />
            <div className="text-3xl md:text-4xl font-black text-[#006B4E]">
              {messages.reduce((acc, msg) => acc + (msg.message ? msg.message.split(' ').length : 0), 0)}
            </div>
            <div className="text-sm text-gray-600 font-semibold mt-1">Palavras Totais</div>
          </div>

          <div className="bg-gradient-to-br from-[#F15A29]/10 to-[#E74C3C]/10 rounded-2xl p-6 text-center backdrop-blur-sm border border-[#F15A29]/20 shadow-lg sm:col-span-2 md:col-span-1">
            <Users className="w-8 h-8 text-[#F15A29] mx-auto mb-3" />
            <div className="text-3xl md:text-4xl font-black text-[#E74C3C]">100%</div>
            <div className="text-sm text-gray-600 font-semibold mt-1">Engajamento</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}