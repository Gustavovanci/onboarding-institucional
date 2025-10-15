// src/pages/BoasVindasPage.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import VideoPlayer from '@/components/common/VideoPlayer';

const accordionItems = [
  { title: "Aqui respeitamos o próximo e as diferenças", content: "Somos mais de 23.000 colaboradores e falar sobre diversidade é falar de todos nós, pois é exatamente disso que somos feitos, das nossas diferenças. O respeito é a chave para experimentarmos a diversidade no nosso dia a dia. Por isso, não toleramos nenhum tipo de discriminação.\n\nO nosso slogan representa a nossa Diversidade: \"Orgulho de fazer o melhor para as pessoas, com as pessoas\".\n\nDesejamos que você some com a sua singularidade e tenha muito orgulho da sua trajetória aqui!" },
  { title: "Aqui colaboramos uns com os outros", content: "Juntos somos melhores, juntos somos +HCFMUSP. Esse é o nosso lema. Ele reforça o espírito de equipe que valorizamos em nossos profissionais. Juntos, não medimos esforços para fazer o melhor para os nossos pacientes." },
  { title: "Aqui compartilhamos conhecimentos", content: "Aprendemos uns com os outros e temos espaço para compartilhar novas ideias. Somos um hospital escola, e portanto reconhecidos como referência para outras instituições de saúde. Aqui você pode contribuir e terá acesso a aprendizados com profissionais muito experientes. Junte-se a nós na promoção dos conhecimentos!" },
  { title: "Aqui celebramos as conquistas", content: "Junte-se a nós no propósito de disseminar as boas práticas e suas conquistas! Fique sempre atento(a) às informações que chegam no seu e-mail: @hc.fm.usp.br, e ao jornal eletrônico semanal Conecta FMUSP-HC, que publiciza semanalmente os nossos resultados e conquistas. Se quiser compartilhar, entre em contato com o Centro de Comunicação Institucional do seu Instituto e informe-se." }
];

const AccordionItem = ({ title, content }: { title: string, content: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
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
            <div className="p-4 bg-blue-50/50 rounded-lg mb-4 text-gray-700 whitespace-pre-line">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function BoasVindasPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Alinhamento de Expectativas</h1>
        <p className="mt-2 text-lg text-gray-600">Conheça a cultura e os valores que nos unem.</p>
      </div>

      <div className="card-elevated p-6 sm:p-8">
        {accordionItems.map(item => <AccordionItem key={item.title} {...item} />)}
      </div>

      <div className="space-y-10">
        <h2 className="text-3xl font-bold text-center text-gray-800">Mensagens Especiais</h2>
        <div>
            <h3 className="text-xl font-semibold mb-4 text-center">O que dizem os nossos Gestores?</h3>
            <VideoPlayer youtubeUrl="https://www.youtube.com/watch?v=SErc_d_tB2I" title="O que dizem os nossos Gestores?" />
        </div>
        <div>
            <h3 className="text-xl font-semibold mb-4 text-center">O que dizem os colaboradores?</h3>
            <VideoPlayer youtubeUrl="https://www.youtube.com/watch?v=SErc_d_tB2I" title="O que dizem os colaboradores?" />
        </div>
      </div>

      <div className="text-center pt-8">
        <Link to="/nosso-papel-sus" className="btn-primary text-lg px-10 py-4">
          Avançar
        </Link>
      </div>
    </div>
  );
}