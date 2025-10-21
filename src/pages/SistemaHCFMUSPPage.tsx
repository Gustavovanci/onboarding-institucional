// src/pages/SistemaHCFMUSPPage.tsx
import { motion } from 'framer-motion';
import { Laptop, ExternalLink } from 'lucide-react'; // Import Laptop and ExternalLink icons

// Dados dos links e imagens (use os nomes corretos dos seus arquivos de imagem)
const systemLinks = [
    { name: "Fundação Zerbini", href: "https://www.fz.org.br/", imageSrc: "/hc/logo-fz.png" }, // Substitua pelo nome real
    { name: "Fundação Faculdade de Medicina", href: "https://www.ffm.br/ffm/portal/index.php", imageSrc: "/hc/logo-ffm.png" }, // Substitua pelo nome real
    { name: "Hospital das Clínicas", href: "https://www.hc.fm.usp.br/hc/portal/", imageSrc: "/hc/logo-hc.png" }, // Substitua pelo nome real
    { name: "Faculdade de Medicina da USP", href: "https://www.fm.usp.br/fmusp/portal/", imageSrc: "/hc/logo-fm.png" } // Substitua pelo nome real
];

export default function SistemaHCFMUSPPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-10" // Adicionado space-y para espaçamento
    >
        {/* Cabeçalho */}
        <div className="text-center">
            <Laptop className="w-16 h-16 mx-auto text-brand-azure mb-4" /> {/* Ícone adicionado */}
            <h1 className="text-4xl font-bold text-gray-900">O Sistema FMUSP HC</h1>
            <p className="mt-4 text-lg text-gray-600">
                Ao clicar nos logos, você será direcionado(a) aos conteúdos das Fundações e Instituições que compõem o nosso complexo.
            </p>
        </div>

        {/* Grid de Logos Clicáveis */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {systemLinks.map((link, index) => (
                <motion.a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: 1.05, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                    className="block bg-white p-6 rounded-2xl shadow-md border border-gray-200/60 aspect-square flex flex-col items-center justify-center text-center transition-all duration-300 group" // aspect-square para manter proporção, flex para centralizar
                >
                    <img
                        src={link.imageSrc}
                        alt={link.name}
                        className="h-20 md:h-24 object-contain mb-4 transition-transform duration-300 group-hover:scale-110" // Imagem maior e efeito de hover
                    />
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-brand-azure transition-colors flex items-center gap-1">
                        {link.name}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                </motion.a>
            ))}
        </div>
    </motion.div>
  );
}

// Remove a exportação duplicada, se houver
// export default SistemaHCFMUSPPage; // Esta linha pode ser removida se já houver 'export default function...'