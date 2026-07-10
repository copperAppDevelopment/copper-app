import { Shield, TrendingDown, Users, Zap, Coins } from "lucide-react";
import { useState } from "react";

export default function AboutUs() {
  const [apartmentUnits, setApartmentUnits] = useState(120);

  // Dynamic calculations for the Colombia residential simulator
  const hoursSaved = Math.round(apartmentUnits * 0.35); // 0.35 hours saved per unit/month
  const delinquencyReduction = "del 28% al 4%";

  // Colombia Pesos (COP) savings calculator
  const monthlyInvoicing = apartmentUnits * 180000; // Estimated admin fee of 180k per unit
  const recoveredMoney = Math.round(monthlyInvoicing * 0.08); // 8% recovered from late payments/delinquency reduction
  const formattedRecoveredMoney = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(recoveredMoney);

  return (
    <section id="nosotros" className="py-24 bg-neutral-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-24">

          {/* Left Side: Text and Metrics Cards */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <p className="text-xs font-bold text-[#8A1C14] dark:text-red-500 uppercase tracking-widest mb-2">
                SOBRE NOSOTROS
              </p>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-neutral-900 dark:text-white leading-tight">
                ¿Quiénes Somos?
              </h2>
              <div className="h-1 w-12 bg-[#8A1C14] dark:bg-red-500 mt-3 rounded"></div>
            </div>

            <div className="space-y-4 text-zinc-600 dark:text-zinc-350">
              <p className="text-base sm:text-lg leading-relaxed">
                Copper App es la plataforma integral para la gestión eficiente de propiedades residenciales en Colombia. Ofrecemos control total sobre tu copropiedad.
              </p>
              <p className="text-base sm:text-lg leading-relaxed font-light">
                Nuestra integración permite un flujo de trabajo más cohesivo, menos errores administrativos y total transparencia — transformando la manera en que las copropiedades gestionan sus operaciones diarias.
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-zinc-100 dark:border-neutral-900 shadow-sm transition-colors duration-300">
                <p className="text-3xl font-extrabold text-[#8A1C14] dark:text-red-500 mb-1">
                  80%
                </p>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-250">
                  Menos tiempo en administración
                </p>
              </div>

              <div className="bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-zinc-100 dark:border-neutral-900 shadow-sm transition-colors duration-300">
                <p className="text-3xl font-extrabold text-[#8A1C14] dark:text-red-500 mb-1">
                  95%
                </p>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-250">
                  Satisfacción de usuarios
                </p>
              </div>

              <div className="bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-zinc-100 dark:border-neutral-900 shadow-sm transition-colors duration-300">
                <p className="text-3xl font-extrabold text-[#8A1C14] dark:text-red-500 mb-1">
                  100%
                </p>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-250">
                  Datos en tiempo real
                </p>
              </div>

              <div className="bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-zinc-100 dark:border-neutral-900 shadow-sm transition-colors duration-300">
                <p className="text-3xl font-extrabold text-[#8A1C14] dark:text-red-500 mb-1">
                  3 veces
                </p>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-250">
                  Más rápido que métodos manuales
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Image with floating lock banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-black">
              {/* Premium generic image showing team shaking hands / residential meeting */}
              <img
                src="/assets/marketing/handshake.webp"
                alt="Reunión de administración"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover filter brightness-[0.98] transition-all hover:scale-102 duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>

            {/* Float Security Badge */}
            <div className="absolute -bottom-6 left-6 right-6 bg-white dark:bg-neutral-950 p-4 rounded-2xl border border-zinc-100 dark:border-neutral-900 shadow-xl flex items-center gap-3.5 transition-colors duration-300">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl">
                <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-850 dark:text-white">
                  Seguridad bancaria
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Datos 100% protegidos y encriptados
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Interactive Savings & Optimization Simulator */}
        <div id="simulador" className="bg-white dark:bg-black rounded-3xl p-8 sm:p-10 border border-[#8A1C14]/10 dark:border-neutral-800/85 shadow-md relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 dark:bg-red-500/10 blur-2xl rounded-full"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Slider configuration */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold text-[#8A1C14] dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded-full uppercase tracking-wider">
                  Novedad
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-neutral-900 dark:text-white mt-3">
                  Simula el impacto de Copper en tu copropiedad
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Arrastrá el control para adaptarlo al tamaño de tu copropiedad.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between font-semibold">
                  <span className="text-zinc-750 dark:text-zinc-350">Unidades de Vivienda:</span>
                  <span className="text-xl text-[#8A1C14] dark:text-red-500 font-bold">{apartmentUnits} apartamentos</span>
                </div>

                <input
                  type="range"
                  min="20"
                  max="450"
                  value={apartmentUnits}
                  onChange={(e) => setApartmentUnits(parseInt(e.target.value))}
                  className="w-full accent-[#8A1C14] cursor-pointer h-2 bg-zinc-100 dark:bg-neutral-800 rounded-lg appearance-none"
                />

                <div className="flex justify-between text-xs text-zinc-400 font-medium">
                  <span>20 unidades (Básico)</span>
                  <span>450 unidades (Profesional+)</span>
                </div>
              </div>
            </div>

            {/* Calculations and results displaying real-time impact */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-zinc-50 dark:bg-neutral-950 p-6 rounded-2xl border border-zinc-100 dark:border-neutral-900/60">

              <div className="flex flex-col justify-between">
                <div>
                  <div className="p-2.5 bg-red-100 dark:bg-red-950/50 rounded-xl w-fit mb-4">
                    <Zap className="w-5 h-5 text-[#8A1C14] dark:text-red-400" />
                  </div>
                  <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Tiempo de Gestión
                  </p>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                    -{hoursSaved} hrs
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    ahorradas por mes en reportes
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <div className="p-2.5 bg-red-100 dark:bg-red-950/50 rounded-xl w-fit mb-4">
                    <TrendingDown className="w-5 h-5 text-[#8A1C14] dark:text-red-400" />
                  </div>
                  <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Morosidad Estimada
                  </p>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                    -85%
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    reducción en cobros demorados
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <div className="p-2.5 bg-red-100 dark:bg-red-950/50 rounded-xl w-fit mb-4">
                    <Coins className="w-5 h-5 text-[#8A1C14] dark:text-red-400" />
                  </div>
                  <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Fondos Recuperados
                  </p>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight break-all">
                    {formattedRecoveredMoney}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    proyectado mensualmente
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
