// src/pages/SegurancaTrabalhoPage.tsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import VideoPlayer from '@/components/common/VideoPlayer';
import { useAuthStore } from '@/stores/authStore';
import { CheckCircle, PlayCircle, Shield } from 'lucide-react';

const contentCards = [
  { title: "Compromisso de Todos", content: "O Hospital das Clínicas da Faculdade de Medicina da USP é um dos maiores complexos hospitalares da América Latina, reunindo ensino, pesquisa e assistência. Por isso, segurança e conduta responsável são compromissos de todos os colaboradores e prestadores de serviço." },
  { title: "Atitudes que Fazem a Diferença", content: "No ambiente hospitalar, pequenas atitudes fazem grande diferença. Cada profissional é responsável por zelar pela segurança de pacientes, colegas e do próprio trabalho — observando regras de circulação, identificação e comunicação adequada." },
  { title: "Prevenção e Atenção", content: "A atenção ao ambiente, o respeito às sinalizações e a prevenção de acidentes são fundamentais. Em qualquer ocorrência ou situação de risco, deve-se acionar o setor responsável ou o bombeiro civil (ramal 2000)." },
  { title: "Comportamento Ético", content: "Manter sigilo e privacidade de pacientes e colegas. Evitar ruídos e distrações em áreas assistenciais. Não realizar fotos, vídeos ou publicações dentro do hospital sem autorização." },
  { title: "Áreas Restritas", content: "Certas áreas, como ressonância magnética, medicina nuclear e alas psiquiátricas, exigem acompanhamento técnico e cuidados especiais com ferramentas e equipamentos, devido aos riscos físicos e operacionais." },
  { title: "Respeito Acima de Tudo", content: "Acima de tudo, segurança no HC significa respeitar pessoas, processos e o ambiente de trabalho. O vídeo de integração complementa essas orientações e mostra, na prática, como cada conduta contribui para um hospital mais seguro e humano." }
];

export default function SegurancaTrabalhoPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const moduleId = 'seguranca-trabalho';

  const isCompleted = user?.completedModules?.includes(moduleId);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <Shield className="w-16 h-16 mx-auto text-brand-red mb-4" />
        <h1 className="text-4xl font-bold text-gray-900">Cuidados e Segurança no HC</h1>
        <p className="mt-2 text-lg text-gray-600">Pequenas atitudes que fazem uma grande diferença no nosso dia a dia.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {contentCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03, zIndex: 10 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200/80"
          >
            <h3 className="font-bold text-lg text-brand-red mb-2">{card.title}</h3>
            <p className="text-gray-700">{card.content}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Vídeo de Integração</h2>
        <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-200/80">
          <VideoPlayer youtubeUrl="https://www.youtube.com/watch?v=ruvIwxdLFTc" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-16 text-center"
      >
        {isCompleted ? (
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 font-semibold px-6 py-3 rounded-xl">
            <CheckCircle className="w-6 h-6" />
            <span>Módulo Concluído!</span>
          </div>
        ) : (
          <button 
            onClick={() => navigate('/seguranca-trabalho/quiz')} 
            className="btn-primary text-lg px-10 py-4 flex items-center gap-2 mx-auto"
          >
            <PlayCircle className="w-5 h-5" />
            Realizar Quiz para Concluir
          </button>
        )}
      </motion.div>
    </div>
  );
}