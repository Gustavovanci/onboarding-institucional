import { motion } from 'framer-motion';

export function SistemaHCFMUSPPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto text-center"
    >
      <h1 className="text-4xl font-bold text-gray-900">Sistema HCFMUSP</h1>
      <p className="mt-4 text-lg text-gray-600">
        Conteúdo sobre o Sistema HCFMUSP em breve.
      </p>
    </motion.div>
  );
}

export default SistemaHCFMUSPPage;