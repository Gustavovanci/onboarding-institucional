// src/pages/InnovationPage.tsx
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

// A palavra "default" aqui é a correção.
export default function InnovationPage () {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto text-center"
    >
      <div className="card-elevated p-8">
        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 text-orange-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Inova HC</h1>
        <p className="mt-4 text-gray-600">
          Esta seção está em desenvolvimento. Em breve, você encontrará aqui informações sobre o ecossistema de inovação do HCFMUSP e como você pode participar.
        </p>
      </div>
    </motion.div>
  );
}