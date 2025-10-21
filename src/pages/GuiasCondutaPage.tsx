// src/pages/GuiasCondutaPage.tsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import VideoPlayer from '@/components/common/VideoPlayer';
import { CheckCircle, PlayCircle, BookText, ExternalLink } from 'lucide-react';

const guideCards = [
    {
        title: "Cartilha de Compliance 2019 - HCFMUSP",
        image: "/hc/compliance.png", // Imagem para Compliance
        link: "https://drive.google.com/file/d/1Bd7dTQBNXDJqESbjHOf-bQBFe-K1vqMN/view",
        content: "Este guia apresenta as diretrizes de conduta ética, integridade e transparência que devem orientar o comportamento de todos os colaboradores do Hospital das Clínicas.\n\nEle explica o que significa Compliance (estar em conformidade com leis e normas), como lidar com conflitos de interesse, a forma correta de receber patrocínios e doações, e como manter relações éticas com fornecedores, pacientes e parceiros.\n\n👉 É indicado que todos os colaboradores conheçam esse material para atuarem com responsabilidade e respeito à missão institucional."
    },
    {
        title: "Guia Prático  Jeito HC de Atender",
        image: "/hc/jeitohc.png", // Imagem para Jeito HC
        link: "https://drive.google.com/file/d/1ks5r1lVKq3z4MUdOf9A1yR__g4O-3Jh1/view",
        content: "Este guia ensina que a excelência no atendimento começa em cada um de nós.\n\nEle aborda temas como comunicação eficaz, apresentação pessoal, atendimento profissional, trabalho em equipe, postura ética, e como lidar com clientes difíceis ou com deficiência.\n\n👉 O objetivo é garantir que todos os pacientes e colegas de trabalho recebam um atendimento humano, empático e profissional, fortalecendo a imagem do HCFMUSP."
    }
];

export default function GuiasCondutaPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const moduleId = 'guias-conduta';
    const isCompleted = user?.completedModules?.includes(moduleId);

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                {/* Imagem do Cabeçalho (Opcional) */}
                
                <h1 className="text-4xl font-extrabold text-gray-900">Guias de Conduta</h1>
                <p className="mt-2 text-lg text-gray-600">Diretrizes essenciais para nossa atuação no HCFMUSP.</p>
            </motion.header>

            {/* Cards dos Guias */}
            <div className="grid md:grid-cols-2 gap-8">
                {guideCards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200/80 flex flex-col"
                    >
                        <a href={card.link} target="_blank" rel="noopener noreferrer" className="block mb-4 rounded-lg overflow-hidden group">
                             <img
                                src={card.image}
                                alt={card.title}
                                className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105" // Ajuste a altura (h-40) conforme necessário
                            />
                        </a>
                        <h3 className="font-bold text-xl text-brand-dark mb-3">{card.title}</h3>
                        <p className="text-gray-700 whitespace-pre-line flex-grow">{card.content.replace(/👉/g, "👉")}</p>
                      
                    </motion.div>
                ))}
            </div>

            {/* Vídeo */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Ética e Conduta na Prática</h2>
                <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-200/80">
                    <VideoPlayer youtubeUrl="https://www.youtube.com/watch?v=jO_d06QrJcI" title="Vídeo sobre Ética e Conduta" />
                </div>
            </motion.section>

            {/* Botão do Quiz */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-16 text-center"
            >
                {isCompleted ? (
                    <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 font-semibold px-6 py-3 rounded-xl">
                        <CheckCircle className="w-6 h-6" />
                        <span>Módulo Concluído!</span>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/guias-conduta/quiz')}
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