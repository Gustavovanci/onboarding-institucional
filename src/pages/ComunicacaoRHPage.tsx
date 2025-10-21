// src/pages/ComunicacaoRHPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { CheckCircle, PlayCircle, ChevronDown, MessageSquare, Building, HelpCircle, ExternalLink } from 'lucide-react';

// --- Dados dos CGPs com Imagens Definidas Diretamente ---
const cgpData = [
    // Caminhos das imagens como você forneceu
    { instituto: "ICESP", horario: "07h às 17h", local: "6º andar", image: "/hc/ICESP1.png" },
    { instituto: "ICHC", horario: "07h às 16h", local: "8º andar", image: "/hc/ICHC1.png" },
    { instituto: "ICr", horario: "07h às 16h", local: "Portaria 2, 2º andar", image: "/hc/ICR1.png" },
    { instituto: "InCor", horario: "07h às 16h", local: "Bloco I, 2º andar", image: "/hc/INCOR1.png" },
    { instituto: "IOT", horario: "07h às 16h", local: "andar térreo, sala 209", image: "/hc/IOT1.png" },
    { instituto: "IPQ", horario: "07h às 16h", local: "1° andar - Ala Sul, sala 81", telefone: "(11) 2661-6657", image: "/hc/IPQ1.png" },
    { instituto: "InRad", horario: "07h às 16h", local: "portaria 1, sala 21", image: "/hc/INRAD1.png" },
    { instituto: "IMREA", nomeCompleto: "IMREA (Lapa)", horario: "09:30 às 16:30h", local: "", image: "/hc/IMREA1.png" },
    { instituto: "IMREA", nomeCompleto: "IMREA (Vila Mariana)", horario: "09:30 às 16:30h", local: "", image: "/hc/IMREA2.png" },
    { instituto: "IMREA", nomeCompleto: "IMREA (Morumbi)", horario: "09:30 às 16:30h", local: "", image: "/hc/IMREA3.png" },
    { instituto: "IMREA", nomeCompleto: "IMREA (Umarizal)", horario: "09:30 às 16:30h", local: "", image: "/hc/IMREA4.png" },
    { instituto: "IMREA", nomeCompleto: "IMREA (Clínicas)", horario: "09:30 às 16:30h", local: "", image: "/hc/IMREA5.png" },
    { instituto: "LIMs", horario: "07h às 16h", local: "FMUSP - 2° andar, sala 2319", image: "/hc/LIM1.png" },
    { instituto: "IGS", nomeCompleto: "Instituto de Gestão e Saúde", horario: "07h às 16h", local: "NGP - 1° andar", image: "/hc/IGS1.png" },
    { instituto: "IPer", horario: "7h às 16h", local: "1° Subsolo", image: "/hc/IPER1.png" },
];

// Componente Acordeão
const AccordionItem = ({ title, content, icon: Icon }: { title: string; content: React.ReactNode; icon: React.ElementType }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b last:border-b-0 border-gray-200">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left py-4 px-1">
                <span className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                    <Icon className="w-5 h-5 text-brand-green1" /> {title}
                </span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown className="text-brand-green1"/></motion.div>
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

export default function ComunicacaoRHPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const moduleId = 'comunicacao-rh';
    const isCompleted = user?.completedModules?.includes(moduleId);

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            <motion.header
                 initial={{ opacity: 0, y: -20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="text-center"
             >
                <MessageSquare className="w-16 h-16 mx-auto text-brand-green1 mb-4" />
                <h1 className="text-4xl font-extrabold text-gray-900">Comunicação com RH</h1>
                <p className="mt-2 text-lg text-gray-600">Seus canais para dúvidas, sugestões e informações sobre Gestão de Pessoas.</p>
            </motion.header>

            {/* Card Fale com RH */}
            <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="grid md:grid-cols-2 gap-8 items-center bg-white p-6 rounded-2xl shadow-lg border border-gray-200/80"
            >
                 <div>
                    <h2 className="text-2xl font-bold text-brand-dark mb-3">Fale com o RH Corporativo</h2>
                    <p className="text-gray-700 mb-4">
                        Você e o seu Responsável Técnico (Gestor/Liderança) podem entrar em contato a qualquer momento para esclarecimentos de dúvidas, sugestões e elogios pelo Canal corporativo Fale com o RH.
                    </p>
                    <AccordionItem title="Entenda como Funciona" icon={HelpCircle} content={
                        <p>Todas as informações registradas neste canal são analisadas pelo Núcleo de Gestão de Pessoas (NGP)...</p>
                    }/>
                </div>
                 <a href="https://servicosngp.hc.fm.usp.br/" target="_blank" rel="noopener noreferrer" className="block hover:opacity-90 transition-opacity">
                     <img src="/hc/fale-rh.png" alt="Fale com o RH" className="rounded-lg shadow-md w-full h-auto object-cover"/>
                 </a>
            </motion.section>

            {/* Seção CGPs */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <div className="text-center mb-8">
                    <Building className="w-10 h-10 mx-auto text-brand-dark mb-2" />
                    <h2 className="text-3xl font-bold text-gray-800">Centros de Gestão de Pessoas (CGP)</h2>
                    <p className="text-gray-600 mt-1 max-w-2xl mx-auto">
                        Em cada Instituto, atua um CGP que faz o atendimento dos seus respectivos colaboradores e se relaciona com o NGP e RHs das Fundações (FFM e FZ).
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cgpData.map((cgp, index) => {
                        const displayName = cgp.nomeCompleto || cgp.instituto;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.05 }}
                                whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                                className="bg-white p-5 rounded-xl shadow-md border border-gray-200/60 flex flex-col"
                            >
                                {/* ✅ Container da Imagem e Título Ajustado */}
                                <div className="flex items-start gap-4 mb-4"> {/* items-start para alinhar texto ao topo se for longo */}
                                    <img
                                        src={cgp.image}
                                        alt={`Imagem ${displayName}`}
                                        // ✅ AUMENTADO PARA w-25 h-25 (64px)
                                        className="w-40 h-40 object-cover rounded-lg flex-shrink-0 shadow-sm"
                                    />
                                    {/* Ajustado para layout vertical */}
                                    <div className="flex flex-col pt-1"> {/* Adicionado pt-1 para alinhar melhor o texto */}
                                        <h4 className="font-bold text-gray-800 text-lg leading-tight">{displayName}</h4>
                                    </div>
                                </div>
                                {/* Informações com Divisor */}
                                <div className="text-sm text-gray-600 space-y-1 mt-auto pt-3 border-t border-gray-100">
                                    {cgp.local && <p><strong>Local:</strong> {cgp.local}</p>}
                                    <p><strong>Horário:</strong> {cgp.horario}</p>
                                    {cgp.telefone && <p><strong>Telefone:</strong> {cgp.telefone}</p>}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.section>

            {/* Botão do Quiz */}
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
                        onClick={() => navigate('/comunicacao-rh/quiz')}
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