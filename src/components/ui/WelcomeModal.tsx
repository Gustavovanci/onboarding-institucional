// src/components/ui/WelcomeModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { Compass } from "lucide-react";

type Props = {
  onClose: () => void;
  onStartTour: () => void;
};

export default function WelcomeModal({ onClose, onStartTour }: Props) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          role="dialog"
          aria-modal="true"
          // CORREÇÃO: Adicionado flexbox, altura máxima e overflow-hidden para o container
          className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Faixa Verde Superior (não encolhe) */}
          <div className="bg-gradient-to-r from-[#006B4E] to-[#009E73] p-4 flex justify-center items-center flex-shrink-0">
            <img 
              src="/hc/HCFMUSP.png" 
              alt="HCFMUSP Logo" 
              className="w-32 brightness-0 invert"
            />
          </div>

          {/* Conteúdo Principal (agora rolável) */}
          <div className="p-8 text-left overflow-y-auto">
            <h1 className="text-3xl font-extrabold text-center text-[#00AEEF] mb-6 tracking-wide">
              BEM-VINDO(A) AO HCFMUSP!
            </h1>
            
            <h2 className="font-bold text-[#004C7E] text-lg mb-2">
              Prezado colaborador(a),
            </h2>

            <div className="space-y-4 text-sm text-[#333333]">
              <p>
                É com grande satisfação que celebramos a sua chegada! Este é o início da sua jornada no HCFMUSP, o maior complexo hospitalar da América Latina!
              </p>
              <p>
                O primeiro passo é a sua integração na Instituição, momento importante para que você conheça a nossa cultura, missão e valores. Este alinhamento é fundamental para que sua integração seja bem-sucedida.
              </p>
              <p>
                👉 Fique atento(a) ao e-mail (<strong className="text-[#0072BC] font-semibold">@hc.fm.usp.br</strong>), pois por meio dele, nós comunicaremos informações importantes para os próximos passos.
              </p>
            </div>
            
            <div className="mt-6 border-t pt-4">
              <h3 className="font-bold text-[#004C7E] text-md">Políticas e Procedimentos Internos</h3>
              <p className="text-[#333333] text-sm">
                Canal de comunicação com os principais documentos e informações úteis para sua integração na Instituição.
              </p>
            </div>
          </div>

          {/* Área Inferior Laranja (não encolhe) */}
          <div className="bg-[#F15A29] text-white p-6 text-sm text-center flex-shrink-0">
            <p>Conte conosco para tirar todas as dúvidas que surgirem.</p>
            <p className="mb-3">Estamos aqui para te auxiliar da melhor maneira possível!</p>
            <p className="font-semibold text-xs opacity-90">
              Equipe Estratégica de Núcleo de Gestão de Pessoas (NGRP), Fundação Faculdade de Medicina (FFM) e Fundação Zerbini.
            </p>
            
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                <button 
                    onClick={onStartTour} 
                    className="flex items-center justify-center gap-2 bg-white/20 border border-white/50 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-white/30 transition-transform hover:scale-105"
                >
                    <Compass className="w-5 h-5"/>
                    Fazer Tour Guiado
                </button>
                <button 
                    onClick={onClose} 
                    className="bg-white text-[#F15A29] font-bold py-3 px-8 rounded-xl shadow-md hover:bg-gray-100 transition-transform hover:scale-105"
                >
                    Começar Agora
                </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}