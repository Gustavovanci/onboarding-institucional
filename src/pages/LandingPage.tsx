// src/pages/LandingPage.tsx

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ConnectedTimeline from "@/components/landing/ConnectedTimeline";
import hcHistoryItems from "@/data/hcHistory";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-light">
      {/* HERO SECTION (sem alterações) */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full bg-brand-azure/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-24 w-[40rem] h-[40rem]rounded-full bg-brand-teal/20 blur-3xl" />
          <div className="absolute top-1/3 -right-20 w-[28rem] h-[28rem] rounded-full bg-brand-red/20 blur-3xl" />
        </div>
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl md:text-6xl font-extrabold leading-tight text-brand-dark">
              Onboarding <span className="text-brand-azure">HC</span>
              <span className="text-brand-teal">FMUSP</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }} className="mt-4 text-lg md:text-xl text-gray-700">
              Integração digital com gamificação, trilhas de conteúdo e uma jornada que começa pela nossa história.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mt-8 flex items-center justify-center gap-4">
              <Link to="/login" className="btn-primary">Entrar com e-mail HC</Link>
              <a href="#historia" className="btn-secondary">Ver História</a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEÇÃO DA HISTÓRIA (altura removida) */}
      <section id="historia" className="container mx-auto px-6 py-16 md:py-24">
        <ConnectedTimeline items={hcHistoryItems} />
      </section>
      
      {/* CTA FINAL (sem alterações) */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="bg-white border border-gray-200/60 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,.06)] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                Pronto para começar sua jornada no HC?
              </h3>
              <p className="text-gray-600 mt-2">
                Faça o login com seu e-mail institucional e conclua os módulos obrigatórios do onboarding.
              </p>
            </div>
            <Link to="/login" className="btn-primary w-full md:w-auto">Começar Onboarding</Link>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} HCFMUSP — Onboarding Digital
      </footer>
    </div>
  );
}