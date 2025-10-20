// src/pages/QuemSomosPage.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle, PlayCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Link } from 'react-router-dom';

const accordionItems = [
  { 
    title: "Missão/Causa", 
    content: "Fazer o melhor para as pessoas, com as pessoas!" 
  },
  { 
    title: "Visão", 
    content: "Ser uma Instituição de excelência, reconhecida nacional e internacionalmente em Ensino, Pesquisa, Assistência e Inovação." 
  },
  { 
    title: "Valores", 
    content: "• Ética\n• Humanismo\n• Responsabilidade Social\n• Pluralismo\n• Pioneirismo\n• Compromisso Institucional"
  }
];

const AccordionItem = ({ title, content }: { title: string, content: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left py-5 px-2">
        <span className="font-semibold text-lg text-brand-dark">{title}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}><ChevronDown className="text-brand-azure"/></motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
           <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-5 px-2 text-gray-700 whitespace-pre-line">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function QuemSomosPage() {
    const { user } = useAuthStore();
    const isCompleted = user?.badges.includes('quiz-quem-somos');

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-brand-azure">Quem Somos</h1>
            </div>

            <div className="card-elevated p-4 sm:p-6">
                {accordionItems.map(item => <AccordionItem key={item.title} {...item} />)}
            </div>
            
            <div className="text-center pt-8">
                {isCompleted ? (
                    <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 font-semibold px-6 py-3 rounded-xl">
                        <CheckCircle className="w-6 h-6" />
                        <span>Quiz Institucional Concluído!</span>
                    </div>
                ) : (
                    <Link to="/quem-somos/quiz" className="btn-primary text-lg px-10 py-4 flex items-center gap-2 mx-auto">
                        <PlayCircle className="w-5 h-5" />
                        Iniciar Quiz
                    </Link>
                )}
            </div>
        </div>
    );
}