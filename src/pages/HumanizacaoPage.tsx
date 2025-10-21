// src/pages/HumanizacaoPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import VideoPlayer from '@/components/common/VideoPlayer'; // Importe o VideoPlayer
import { CheckCircle, PlayCircle, ChevronDown, HeartHandshake, ListChecks, HelpCircle } from 'lucide-react';

// --- Dados dos Cards ---
const responsibilities = [
    "Elaborar diretivas técnicas de humanização para o Sistema FMUSPHC;",
    "Desenvolver e coordenar a Rede Humaniza FMUSPHC;",
    "Desenvolver a cultura da humanização no hospital e na faculdade;",
    "Fazer diagnósticos de situação e propor iniciativas de humanização;",
    "Desenvolver indicadores de humanização e monitorá-los;",
    "Elaborar e divulgar relatórios com indicadores de humanização;",
    "Coordenar a criação de grupos de trabalho de humanização quando necessário;",
    "Elaborar material técnico e científico de humanização;",
    "Desenvolver ações de ensino em humanização;",
    "Desenvolver projetos corporativos de humanização;",
    "Desenvolver pesquisas em humanização;",
    "Colaborar para a divulgação da humanização;",
    "Supervisionar a Ouvidoria Geral do HC;",
    "Coordenar as ações de humanização da Diretoria Executiva da FMUSP."
];

const importanceContent = "Humanização é um campo de conhecimento transversal na área da saúde que concentra esforços sobre a qualidade ética e empática das relações interpessoais nas práticas de atenção, gestão e ensino. Seu desenvolvimento se dá por meio de ações institucionais que promovem valores e comportamentos para uma cultura de humanização fortemente ancorada no respeito mútuo e no trabalho colaborativo para o bem comum.";

// Componente Acordeão reutilizado
const AccordionItem = ({ title, content, icon: Icon }: { title: string; content: React.ReactNode; icon: React.ElementType }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b last:border-b-0 border-gray-200">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left py-4 px-1">
                <span className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                    <Icon className="w-5 h-5 text-brand-azure" /> {title}
                </span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown className="text-brand-azure"/></motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="pb-4 px-1 text-gray-700">{content}</div>
                </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function HumanizacaoPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const moduleId = 'humanizacao';
    const isCompleted = user?.completedModules?.includes(moduleId);

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <img src="/hc/NH.png" alt="Humanização HC" className="mx-auto mb-4 h-24 object-contain"/> {/* Imagem do cabeçalho */}
                <h1 className="text-4xl font-extrabold text-gray-900">Núcleo de Humanização (NH)</h1>
                <p className="mt-2 text-lg text-gray-600">Promovendo relações éticas e empáticas no HCFMUSP.</p>
            </motion.header>

            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200/80"
            >
                <p className="text-gray-700 leading-relaxed">
                    O Núcleo Técnico e Científico de Humanização (NH) é uma equipe formada por profissionais de diversas áreas do conhecimento e empreende políticas institucionais e propostas inovadoras para a humanização na assistência, no ensino, na gestão, na pesquisa e na cultura e extensão, em benefício de usuários, estudantes e profissionais da saúde. O NH faz parte da Diretoria Clínica do Hospital das Clínicas e está instalado no sexto andar do Instituto de Gestão e Saúde do HCFMUSP.
                </p>
            </motion.section>

            <motion.section
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.4 }}
                 className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200/80"
            >
                 <AccordionItem title="Responsabilidades do NH" icon={ListChecks} content={
                     <ul className="list-disc list-inside space-y-1 pl-2">
                        {responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                     </ul>
                 }/>
                 <AccordionItem title="Por que a Humanização é importante?" icon={HelpCircle} content={
                    <p className="whitespace-pre-line">{importanceContent}</p>
                 }/>
            </motion.section>

            {/* Espaço para o Vídeo */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Conheça mais sobre Humanização</h2>
                <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-200/80">
                    {/* Substitua pela URL correta do vídeo se houver */}
                    <VideoPlayer youtubeUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="Vídeo sobre Humanização (Placeholder)" />
                </div>
            </motion.section>


            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
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
                        onClick={() => navigate('/humanizacao/quiz')}
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