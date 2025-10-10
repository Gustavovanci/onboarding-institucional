// src/pages/BenefitsPage.tsx
import { Gift } from 'lucide-react';
import { motion } from 'framer-motion';

// ESSA LINHA É A MAIS IMPORTANTE
export default function BenefitsPage () {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto text-center"
    >
      <div className="card-elevated p-8">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Gift className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Página de Benefícios</h1>
        <p className="mt-4 text-gray-600">
          Esta seção está em desenvolvimento. Em breve, você encontrará aqui todas as informações sobre os benefícios oferecidos aos colaboradores do HCFMUSP.
        </p>
      </div>
    </motion.div>
  );
}