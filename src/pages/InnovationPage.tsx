// src/pages/InnovationPage.tsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import VideoPlayer from '@/components/common/VideoPlayer';
import { CheckCircle, PlayCircle, Lightbulb, Link as LinkIcon, Users, Rocket, ExternalLink } from 'lucide-react'; // Zap removido se não for mais usado

const coreActivities = [
    { icon: Rocket, text: "Viabilizamos soluções e negócios inovadores para o HCFMUSP e para o sistema de saúde." },
    { icon: Lightbulb, text: "Promovemos a cultura de inovação e o empreendedorismo científico." },
    { icon: Users, text: "Mapeamos desafios reais do setor de saúde e codesenvolvemos tecnologias em ambiente de referência." },
    { icon: LinkIcon, text: "Conectamos o ecossistema de inovação em saúde no Brasil e no mundo." }
];

export default function InnovationPage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const moduleId = 'inovahc';
    const isCompleted = user?.completedModules?.includes(moduleId);

    return (
        <div className="max-w-5xl mx-auto space-y-16 p-4">
            {/* Cabeçalho */}
            <motion.header
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-center space-y-4"
            >
                {/* ✅ Ícone substituído por imagem clicável */}
                <a href="https://inovahc.com.br/" target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-90 transition-opacity duration-300">
                     <img
                        src="/hc/inovahc.png" // Use o caminho correto da sua imagem
                        alt="Logo InovaHC"
                        className="h-20 md:h-24 mx-auto object-contain" // Ajuste o tamanho conforme necessário
                     />
                </a>
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-azure via-brand-green1 to-brand-green2">
                    InovaHC
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    O Núcleo de Inovação Tecnológica do Hospital das Clínicas da FMUSP.
                </p>
            </motion.header>

            {/* Conteúdo Principal (sem alterações) */}
            <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="bg-white/50 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-gray-200/80"
            >
                {/* ... (conteúdo dos cards de atividades) */}
                 <p className="text-lg text-center text-gray-800 leading-relaxed">
                    Desde 2015, somos agentes de transformação, conectando pesquisadores, empreendedores, colaboradores e parceiros para criar soluções que geram impacto real na saúde do Brasil. Nosso propósito é <strong className="text-brand-green2">transformar conhecimento em inovação aplicada</strong>.
                </p>

                <div className="mt-10 grid md:grid-cols-2 gap-6">
                    {coreActivities.map((activity, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.15 }}
                            className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
                        >
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-brand-azure rounded-lg flex items-center justify-center">
                                <activity.icon className="w-6 h-6"/>
                            </div>
                            <p className="text-gray-700">{activity.text}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Vídeo */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.7 }}
                className="space-y-6"
            >
                <h2 className="text-3xl font-bold text-center text-gray-800">Nossa Missão em Ação</h2>
                <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                    <VideoPlayer youtubeUrl="https://www.youtube.com/watch?v=H8nIFk_bLbc" />
                </div>
                 {/* ✅ Botão "Visite o site" removido daqui */}
            </motion.section>

            {/* Botão do Quiz (sem alterações) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="text-center pt-8"
            >
                {/* ... (código do botão do quiz) */}
                 {isCompleted ? (
                    <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 font-semibold px-6 py-3 rounded-xl">
                        <CheckCircle className="w-6 h-6" />
                        <span>Módulo Concluído!</span>
                    </div>
                ) : (
                    <button onClick={() => navigate('/innovation/quiz')} className="btn-primary text-lg px-10 py-4 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transition-shadow">
                        <PlayCircle className="w-5 h-5" />
                        Realizar Quiz para Concluir
                    </button>
                )}
            </motion.div>
        </div>
    );
}