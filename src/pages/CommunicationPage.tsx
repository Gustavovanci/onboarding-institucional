// src/pages/CommunicationPage.tsx
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

// A palavra "default" aqui é a correção.
export default function CommunicationPage () {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto text-center"
    >
      <div className="card-elevated p-8">
        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Canais de Comunicação</h1>
        <p className="mt-4 text-gray-600">
          Esta seção está em desenvolvimento. Em breve, você encontrará aqui os links e informações sobre os principais canais de comunicação interna do HCFMUSP.
        </p>
      </div>
    </motion.div>
  );
}