import { Play, ArrowRight, CheckCircle2 } from "lucide-react";
import CitySkyline from "./CitySkyline";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-red-50/30 via-white to-red-50/10 dark:from-black dark:via-black dark:to-neutral-950 pt-16 pb-36 sm:pb-44 md:pb-[340px] md:pt-24 transition-colors duration-300">
      
      {/* Background radial glowing effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-100/40 dark:bg-red-950/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-amber-50/30 dark:bg-amber-950/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        
        {/* Trusted Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-950/30 border border-[#8A1C14]/15 dark:border-red-900/40 text-[#8A1C14] dark:text-red-300 text-xs sm:text-sm font-semibold tracking-wide mb-6 animate-fade-in">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </span>
          +500 conjuntos residenciales en Colombia confían en Copper
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-neutral-900 dark:text-white leading-[1.12] tracking-tight max-w-4xl mx-auto mb-6">
          Simplifica la{" "}
          <span className="text-[#8A1C14] dark:text-red-500 relative inline-block">
            Administración
          </span>{" "}
          de tu Copropiedad
        </h1>



        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a
            href="#contacto"
            className="flex items-center justify-center gap-2 bg-[#8A1C14] hover:bg-[#a1231a] active:bg-[#721710] text-white px-8 py-4 rounded-full text-base font-semibold shadow-lg shadow-red-900/10 hover:shadow-red-900/25 transition-all duration-200 transform hover:-translate-y-0.5 w-full sm:w-auto"
          >
            Comenzar Ahora
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        {/* Features Checklist */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#8A1C14] dark:text-red-500" />
            <span>Sin contratos forzosos</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#8A1C14] dark:text-red-500" />
            <span>14 días de prueba gratis</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#8A1C14] dark:text-red-500" />
            <span>Soporte 24/7 en español</span>
          </div>
        </div>

      </div>

      {/* Exquisite SVG Landscape of City Buildings matching the original image */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden pointer-events-none select-none translate-y-3">
        <CitySkyline />
      </div>

    </section>
  );
}
