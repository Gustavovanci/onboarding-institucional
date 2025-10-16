// src/pages/InnovationPage.tsx
import { motion } from 'framer-motion';
import VideoPlayer from '@/components/common/VideoPlayer';

export default function InnovationPage () {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        {/* CORREÇÃO: Ícone de raio substituído por um placeholder de imagem */}
        <img
          src="/images/inovahc-logo.png" // <-- Você pode alterar este caminho para o local do seu arquivo de imagem
          alt="InovaHC Logo"
          className="w-48 mx-auto mb-4 object-contain"
        />
        <h1 className="text-4xl font-bold text-gray-900 mt-4">InovaHC</h1>
        <p className="mt-2 text-lg text-gray-600">O Núcleo de Inovação Tecnológica do Hospital das Clínicas da FMUSP.</p>
      </div>
      
      <div className="card-elevated p-8 space-y-6">
        <p className="text-lg text-gray-700">Desde 2015, somos agentes de transformação, conectando pesquisadores, empreendedores, colaboradores e parceiros para criar soluções que geram impacto real na saúde do Brasil. Nosso propósito é transformar conhecimento em inovação aplicada, contribuindo para a melhoria da qualidade de vida das pessoas e para a sustentabilidade do sistema de saúde.</p>
        
        <div>
            <h3 className="text-xl font-bold mb-2">O que fazemos:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Viabilizamos soluções e negócios inovadores para o HCFMUSP e para o sistema de saúde.</li>
                <li>Promovemos a cultura de inovação e o empreendedorismo científico.</li>
                <li>Mapeamos desafios reais do setor de saúde.</li>
                <li>Codesenvolvemos e validamos tecnologias em ambiente de referência.</li>
                <li>Conectamos o ecossistema de inovação em saúde no Brasil e no mundo.</li>
            </ul>
        </div>

        <div className="pt-4">
            <VideoPlayer youtubeUrl="https://www.youtube.com/watch?v=H8nIFk_bLbc" />
        </div>

        <div className="text-center pt-4">
            <a href="https://inovahc.com.br/" target="_blank" rel="noopener noreferrer" className="btn-primary inline-block">
                Visite o site do InovaHC
            </a>
        </div>
      </div>
    </motion.div>
  );
}