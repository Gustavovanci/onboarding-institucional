// src/components/landing/ScrollableTimeline.tsx
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import type { HistoryItem } from '@/data/hcHistory';

type Props = {
  items: HistoryItem[];
};

// Array de cores institucionais para usar nos cards, baseado no seu tailwind.config.js
const brandColors = [
  '#2B97D4', // brand-azure
  '#20856B', // brand-green1
  '#E74121', // brand-red
  '#136D5E', // brand-green2
  '#237450', // brand-green4
];

// Componente para cada evento individual na timeline
const TimelineEvent = ({ item, index }: { item: HistoryItem; index: number }) => {
  // Define se o card aparecerá na esquerda ou na direita
  const isOdd = index % 2 !== 0;
  // Pega uma cor do array de forma cíclica
  const color = brandColors[index % brandColors.length];

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ minHeight: '350px' }} // Garante espaço entre os itens
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8 }}
    >
      {/* Marco Anual Redondo */}
      <motion.div
        className="absolute z-10 w-24 h-24 rounded-full flex items-center justify-center font-bold text-white text-xl shadow-lg"
        style={{ backgroundColor: color }}
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
      >
        {item.year}
      </motion.div>

      {/* Card de Conteúdo */}
      <div 
        className={`w-5/12 ${isOdd ? 'ml-[58.33%]' : 'mr-[58.33%]'}`}
      >
        <motion.div
          className="bg-white p-4 rounded-2xl shadow-xl hover:shadow-2xl border border-gray-200/60 transition-all duration-300 hover:-translate-y-1"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="aspect-video w-full rounded-lg overflow-hidden mb-3">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-md font-bold text-gray-800">{item.title}</h3>
          <p className="text-gray-600 mt-1 text-sm">{item.description}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Componente principal da Timeline
export default function ScrollableTimeline({ items }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  const lineHeight = useTransform(scrollYProgress, val => `${val * 100}%`);

  return (
    <div className="w-full max-w-5xl mx-auto py-12">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Uma história de Excelência e Inovação
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mt-2">
          Role para baixo e navegue pelos marcos que moldaram o ensino, a pesquisa e a assistência no país.
        </p>
      </div>
      
      <div ref={scrollRef} className="relative">
        {/* Linha de fundo */}
        <div className="absolute left-1/2 top-0 w-1 h-full bg-gray-200 -translate-x-1/2"></div>
        
        {/* Linha animada com gradiente */}
        <motion.div 
          className="absolute left-1/2 top-0 w-1 bg-gradient-to-b from-brand-azure via-brand-green1 to-brand-green3 -translate-x-1/2"
          style={{ height: lineHeight }}
        ></motion.div>

        <div className="space-y-4">
            {items.map((item, index) => (
              <TimelineEvent 
                key={item.year} 
                item={item} 
                index={index}
              />
            ))}
        </div>
      </div>
    </div>
  );
}