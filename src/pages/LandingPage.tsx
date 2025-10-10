// src/pages/LandingPage.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ConnectedTimeline from "@/components/landing/ConnectedTimeline"; // Importa o componente correto
import hcHistoryItems from "@/data/hcHistory";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-light">
      {/* SEÇÃO HERO */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full bg-brand-azure/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-24 w-[40rem] h-[40rem] rounded-full bg-brand-teal/20 blur-3xl" />
          <div className="absolute top-1/3 -right-20 w-[28rem] h-[28rem] rounded-full bg-brand-red/20 blur-3xl" />
        </div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} 
          className="text-4xl md:text-6xl font-extrabold leading-tight text-brand-dark"
        >
          Onboarding <span className="text-brand-azure">HC</span>FMUSP
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.1 }} 
          className="mt-4 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto"
        >
          Integração digital com gamificação, trilhas de conteúdo e uma jornada que começa pela nossa história.
        </motion.p>

        <motion.a 
          href="#historia" 
          className="absolute bottom-12 flex flex-col items-center text-gray-600 hover:text-brand-azure transition-colors z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="mb-2 font-semibold">Role a página para conhecer nossa história</span>
          <ChevronDown className="w-8 h-8" />
        </motion.a>
      </section>

      {/* SEÇÃO DA HISTÓRIA (TIMELINE) - AGORA SÓ CHAMA O COMPONENTE */}
      <section id="historia" className="container mx-auto px-6 py-16 md:py-24">
        <ConnectedTimeline items={hcHistoryItems} />
      </section>

      {/* SEÇÃO DE VÍDEO INSTITUCIONAL */}
      <section id="video" className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">
              Nossa Missão em Ação
            </h2>
            <div className="aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-200/80">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/SErc_d_tB2I"
                title="Vídeo Institucional HCFMUSP"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="bg-white border border-gray-200/60 rounded-2xl shadow-card p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                Pronto para começar sua jornada no HC?
              </h3>
              <p className="text-gray-600 mt-2">
                Faça o login com seu e-mail institucional para iniciar os módulos de integração.
              </p>
            </div>
            <Link to="/login" className="btn-primary w-full md:w-auto flex-shrink-0">
              Começar Onboarding
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} HCFMUSP — Onboarding Digital
      </footer>
    </div>
  );
}