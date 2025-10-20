// src/pages/HistoryPage.tsx
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ScrollableTimeline from '@/components/landing/ScrollableTimeline';
import hcHistoryItems from '../data/hcHistory';
import VideoPlayer from '@/components/common/VideoPlayer';
import { useAuthStore } from '@/stores/authStore';
import { CheckCircle, PlayCircle } from 'lucide-react';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const moduleId = 'nossa-historia'; // ID fixo para este módulo

  // Verifica se o usuário já completou este módulo
  const isCompleted = user?.completedModules?.includes(moduleId);

  return (
    <div className="space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <ScrollableTimeline items={hcHistoryItems} />
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
        
        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-200/80">
          <VideoPlayer 
            youtubeUrl="https://www.youtube.com/watch?v=l3ORGRlZXvQ" 
            title="Vídeo Institucional HCFMUSP"
          />
        </div>
      </motion.div>

      {/* BOTÃO PARA O QUIZ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-16 text-center"
      >
        {isCompleted ? (
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 font-semibold px-6 py-3 rounded-xl">
            <CheckCircle className="w-6 h-6" />
            <span>Módulo Concluído!</span>
          </div>
        ) : (
          <button 
            onClick={() => navigate(`/modules/${moduleId}/quiz`)} 
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <PlayCircle className="w-5 h-5" />
            Realizar Quiz para Concluir
          </button>
        )}
      </motion.div>
    </div>
  );
}