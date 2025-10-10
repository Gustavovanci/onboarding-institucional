// src/components/landing/HistoryTimeline.tsx

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { HistoryItem } from "@/data/hcHistory";

type Props = {
  items: HistoryItem[];
};

const Card = ({ item }: { item: HistoryItem }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "start 30%"] });
  const y = useTransform(scrollYProgress, [0, 1], [30, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const sideClass =
    item.side === "right"
      ? "lg:col-start-7 lg:col-end-13 lg:text-left"
      : "lg:col-start-1 lg:col-end-7 lg:text-right";

  const cardContent = (
    <motion.div
      style={{ y, opacity }}
      className="inline-flex max-w-xl w-full bg-white border border-gray-200/60 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,.06)] overflow-hidden text-left"
    >
      <div className="w-36 shrink-0 bg-brand-azure/10 grid place-items-center">
        {item.image ? (
          // ESTA É A ESTRUTURA CORRETA QUE IRÁ FUNCIONAR
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg flex items-center justify-center">
            <img
              src={item.image}
              alt={`${item.year}`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-xl bg-brand-azure text-white grid place-items-center text-xl font-extrabold">
            {item.year}
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="text-xs font-bold text-brand-azure/80">{item.year}</div>
        <h3 className="text-lg font-bold text-gray-900 leading-tight">{item.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
      </div>
    </motion.div>
  );

  return (
    <div ref={ref} className="grid grid-cols-12 gap-6 items-center">
      <div className="col-span-12 lg:col-span-12 relative">
        <div className="absolute left-1/2 -translate-x-1-2 h-full w-px bg-gray-200/80 hidden lg:block" />
      </div>
      <div className={`col-span-12 ${sideClass}`}>
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform duration-300 hover:scale-[1.02] inline-block"
          >
            {cardContent}
          </a>
        ) : (
          cardContent
        )}
      </div>
    </div>
  );
};


export default function HistoryTimeline({ items }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="relative">
      <div className="hidden xl:block absolute left-6 top-0 bottom-0 w-1 bg-gray-200/70 rounded-full overflow-hidden">
        <motion.div
          style={{ height: progressHeight }}
          className="absolute left-0 bottom-0 w-full bg-gradient-to-b from-brand-azure to-brand-teal"
        />
      </div>
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Uma história de <span className="text-brand-azure">Excelência</span> e{" "}
          <span className="text-brand-teal">Inovação</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mt-2">
          A linha do tempo do HCFMUSP em marcos que moldaram o ensino, a pesquisa e a assistência no país.
        </p>
      </div>
      <div className="relative lg:mx-12">
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gray-200/80" />
        <div className="space-y-10 lg:space-y-16">
          {items.map((item, i) => (
            <Card key={`${item.year}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}