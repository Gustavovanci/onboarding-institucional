// src/components/landing/ConnectedTimeline.tsx

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import type { HistoryItem } from "@/data/hcHistory";

type Props = {
  items: HistoryItem[];
};

function TimelineItem({ item, x, y, index, totalItems, scrollYProgress }: { item: HistoryItem; x: number; y: number; index: number; totalItems: number; scrollYProgress: any; }) {
  const itemProgress = index / (totalItems - 1);
  
  // MODIFICAÇÃO: Janelas de animação mais amplas e responsivas
  const pointAnimationStart = Math.max(0, itemProgress - 0.15);
  const pointAnimationEnd = itemProgress - 0.05;
  const cardAnimationStart = Math.max(0, itemProgress - 0.1);
  const cardAnimationEnd = Math.min(1, itemProgress + 0.05);

  // Animações do ponto mais rápidas
  const dotScale = useTransform(scrollYProgress, [pointAnimationStart, pointAnimationEnd], [0, 1]);
  const dotOpacity = useTransform(scrollYProgress, [pointAnimationStart, pointAnimationEnd], [0, 1]);

  // Animações do card mais diretas e rápidas
  const cardOpacity = useTransform(scrollYProgress, [cardAnimationStart, cardAnimationEnd], [0, 1]);
  const cardScale = useTransform(scrollYProgress, [cardAnimationStart, cardAnimationEnd], [0.9, 1]);
  const cardY = useTransform(scrollYProgress, [cardAnimationStart, cardAnimationEnd], [30, 0]);

  return (
    <>
      <motion.div style={{ position: 'absolute', left: x - 8, top: y - 8, opacity: dotOpacity, scale: dotScale }} className="w-4 h-4 relative z-20">
        <motion.div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-teal-500 rounded-full blur-sm opacity-60" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full border-2 border-white shadow-lg" />
      </motion.div>

      <motion.div
        style={{
          position: 'absolute', left: x, top: y,
          opacity: cardOpacity, scale: cardScale, y: cardY,
          transformOrigin: 'center',
          transform: `translateX(${item.side === 'left' ? '-100%' : '50px'})`,
        }}
        whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
        className="w-96 cursor-pointer group"
      >
        <div className={`flex items-center gap-6 ${item.side === 'right' ? 'flex-row-reverse' : ''}`}>
          <motion.div whileHover={{ scale: 1.1 }} className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
            <img src={item.image} alt={item.title} className="relative w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl" />
          </motion.div>
          <motion.div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200/50 w-full group-hover:shadow-2xl transition-all duration-300">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm font-bold mb-3 shadow-md">{item.year}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">{item.title}</h3>
            <p className="text-gray-600 leading-relaxed">{item.description}</p>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

export default function ConnectedTimeline({ items }: Props) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start center", "end center"],
  });
  
  // MODIFICAÇÃO: Spring muito mais responsivo para scroll rápido
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 20,
    restDelta: 0.0001
  });

  const PADDING_Y = 200;
  const ITEM_SPACING = 380;
  const ZIGZAG_WIDTH = 350;
  const CENTER_X = 250;

  const totalHeight = PADDING_Y * 2 + (items.length - 1) * ITEM_SPACING;
  const itemPositions: { x: number; y: number }[] = [];

  items.forEach((item, index) => {
    const y = PADDING_Y + index * ITEM_SPACING;
    const x = item.side === 'left' ? CENTER_X - ZIGZAG_WIDTH / 2 : CENTER_X + ZIGZAG_WIDTH / 2;
    itemPositions.push({ x, y });
  });

  let pathDefinition = "";
  itemPositions.forEach((pos, index) => {
    if (index === 0) {
      pathDefinition += `M ${pos.x} ${pos.y}`;
    } else {
      const prevPos = itemPositions[index - 1];
      const midY = prevPos.y + (pos.y - prevPos.y) / 2;
      pathDefinition += ` C ${prevPos.x} ${midY}, ${pos.x} ${midY}, ${pos.x} ${pos.y}`;
    }
  });
  
  // MODIFICAÇÃO: Linha sempre visível, só varia na opacidade
  const strokeWidth = useTransform(smoothScroll, [0, 0.05, 0.95, 1], [2, 4, 4, 2]);
  const strokeOpacity = useTransform(smoothScroll, [0, 0.02, 0.98, 1], [0.3, 1, 1, 0.3]);

  return (
    <div className="py-20">
      <div className="text-center mb-24">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Uma história de <span className="bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">Excelência</span> e <span className="bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">Inovação</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">Acompanhe os marcos que moldaram o ensino, a pesquisa e a assistência no país.</p>
        </motion.div>
      </div>

      <div ref={targetRef} className="relative mx-auto w-[500px]" style={{ height: totalHeight }}>
        <svg className="absolute top-0 left-0 w-full h-full" viewBox={`0 0 500 ${totalHeight}`}>
          <motion.path
            fill="none"
            stroke="url(#lineGradient)"
            strokeLinecap="round"
            d={pathDefinition}
            style={{ pathLength: smoothScroll, strokeWidth, opacity: strokeOpacity }}
          />
          <defs>
            <linearGradient id="lineGradient" gradientTransform="rotate(90)">
              <stop offset="0%" stopColor="#00AEEF" /><stop offset="100%" stopColor="#00A99D" />
            </linearGradient>
          </defs>
        </svg>

        {items.map((item, index) => (
          <TimelineItem
            key={`${item.year}-${index}`}
            item={item}
            x={itemPositions[index].x}
            y={itemPositions[index].y}
            totalHeight={totalHeight}
            scrollYProgress={smoothScroll}
            index={index}
            totalItems={items.length}
          />
        ))}
      </div>
    </div>
  );
}