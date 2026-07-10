import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { FaqItem } from "../../types";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FaqItem[] = [
    {
      question: "¿Copper App funciona para todo tipo de copropiedad?",
      answer: "Sí, Copper App es totalmente modular y escalable. Funciona a la perfección para conjuntos residenciales de casas, edificios de apartamentos, condominios campestres, ciudadelas residenciales e incluso complejos comerciales y de oficinas híbridas en Colombia."
    },
    {
      question: "¿Cuánto tiempo toma la implementación?",
      answer: "Por lo general, toma entre 24 y 48 horas tener tu plataforma activa. Nuestro equipo te ayuda con la carga masiva inicial de datos de los residentes, torres, parqueaderos y saldos pendientes para que la transición sea rápida, libre de fricciones y 100% asistida."
    },
    {
      question: "¿Es segura la información de la copropiedad?",
      answer: "Absolutamente. Contamos con protocolos de seguridad bancaria SSL robustos con encriptración AES-256 bits, copias de seguridad diarias automatizadas y servidores alojados en la nube con redundancia geográfica. Toda la información financiera y residencial cumple estrictamente con la ley de Habeas Data en Colombia."
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-neutral-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title Group */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-[#8A1C14] dark:text-red-500 uppercase tracking-widest mb-2">
            PREGUNTAS FRECUENTES
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-neutral-900 dark:text-white leading-tight">
            Preguntas frecuentes
          </h2>
          <div className="h-1 w-12 bg-[#8A1C14] dark:bg-red-500 mx-auto mt-4 rounded"></div>
        </div>

        {/* Accordion Container */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white dark:bg-neutral-950 rounded-2xl border border-zinc-100 dark:border-neutral-900 shadow-sm overflow-hidden transition-all duration-300"
              >
                {/* Trigger Button */}
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-base sm:text-lg text-zinc-800 dark:text-zinc-100 pr-4 hover:text-[#8A1C14] dark:hover:text-red-400 transition-colors duration-150">
                    {faq.question}
                  </span>
                  <div className={`p-2 rounded-xl bg-zinc-50 dark:bg-neutral-900 text-zinc-500 dark:text-zinc-400 transition-transform duration-300 ${isOpen ? "rotate-180 bg-[#8A1C14]/10 dark:bg-red-950/45 text-[#8A1C14] dark:text-red-400" : ""}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {/* Answer panel */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-60 border-t border-zinc-50 dark:border-neutral-900" : "max-h-0"}`}
                >
                  <p className="p-6 text-zinc-600 dark:text-zinc-350 text-sm leading-relaxed font-light">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
