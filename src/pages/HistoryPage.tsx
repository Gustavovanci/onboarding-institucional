// src/pages/HistoryPage.tsx
import { motion } from 'framer-motion';
import InteractiveTimeline from '@/components/landing/InteractiveTimeline';
import hcHistoryItems from '../data/hcHistory';

export default function HistoryPage() {
  return (
    <div className="space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <InteractiveTimeline items={hcHistoryItems} />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">
          Nossa Missão em Ação
        </h2>
        <div className="aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-200/80">
          <iframe 
            className="w-full h-full"
            src="https://www.youtube.com/embed/SErc_d_tB2I"
            title="Vídeo Institucional HCFMUSP"
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
      </motion.div>
    </div>
  );
}