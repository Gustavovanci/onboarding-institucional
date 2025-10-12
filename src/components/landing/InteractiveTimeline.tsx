// src/components/landing/InteractiveTimeline.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HistoryItem } from '@/data/hcHistory';

type Props = {
  items: HistoryItem[];
};

const TimelineCard = ({ item }: { item: HistoryItem }) => (
  <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
    <img src={item.image} alt={item.title} className="w-full sm:w-32 h-32 rounded-lg object-cover border-2 border-white shadow-md flex-shrink-0" />
    <div className="flex-1">
      <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
      <p className="text-gray-600 mt-1">{item.description}</p>
    </div>
  </div>
);

export default function InteractiveTimeline({ items }: Props) {
  const [selectedYear, setSelectedYear] = useState<number | string | null>(items[0]?.year || null);

  return (
    <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                Uma história de Excelência e Inovação
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-2">
                Navegue pelos marcos que moldaram o ensino, a pesquisa e a assistência no país.
            </p>
        </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4 flex md:flex-col overflow-x-auto pb-4 md:pb-0 border-b md:border-b-0 md:border-r pr-4">
          {items.map((item) => (
            <button
              key={item.year}
              onClick={() => setSelectedYear(item.year)}
              className={`flex-shrink-0 text-left p-3 w-full rounded-lg transition-all duration-200 ${
                selectedYear === item.year
                  ? 'bg-brand-azure text-white font-bold shadow'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              Ano de {item.year}
            </button>
          ))}
        </div>
        <div className="md:w-3/4">
          <AnimatePresence mode="wait">
            {items.map((item) =>
              selectedYear === item.year ? (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-6 rounded-xl shadow-card border border-gray-200/60"
                >
                  <TimelineCard item={item} />
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}