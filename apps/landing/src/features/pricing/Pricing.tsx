import { Check } from "lucide-react";
import { useState } from "react";
import { selectedPlanStore } from "../../stores/appStore";
import type { Database } from "@copper/database";

type DbPlan = Database["public"]["Tables"]["planes"]["Row"];

interface PricingProps {
  plans: DbPlan[];
}

export default function Pricing({ plans }: PricingProps) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "quarterly" | "yearly">("monthly");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section id="precios" className="py-24 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold text-[#8A1C14] dark:text-red-500 uppercase tracking-widest mb-2">
            PRECIOS
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-neutral-900 dark:text-white leading-tight">
            Inversión que se paga sola
          </h2>
          <div className="h-1 w-12 bg-[#8A1C14] dark:bg-red-500 mx-auto mt-4 rounded"></div>
          <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg mt-4 leading-relaxed font-light">
            Planes flexibles para copropiedades de cualquier tamaño en pesos colombianos.
          </p>

          {/* Segmented billing period selector (3 options: Mensual, Trimestral, Anual) */}
          <div className="flex items-center justify-center mt-10">
            <div className="inline-flex rounded-xl p-1 bg-zinc-100 dark:bg-neutral-900 border border-zinc-200 dark:border-neutral-800">
              {(["monthly", "quarterly", "yearly"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setBillingPeriod(period)}
                  className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    billingPeriod === period
                      ? "bg-[#8A1C14] dark:bg-red-500 text-white shadow-sm"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  {period === "monthly" ? "Mensual" : period === "quarterly" ? "Trimestral" : "Anual"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
          {plans.map((plan) => {
            const isPro = plan.nombre.toLowerCase().includes("pro") || plan.nombre.toLowerCase().includes("profesional");
            
            // Extraer y procesar los precios de la base de datos
            const priceMonthly = plan.precio_mensual ?? 0;
            const priceQuarterly = plan.precio_trimestral ?? 0;
            const priceYearly = plan.precio_anual ?? 0;

            // Determinar el precio mensual equivalente según el periodo seleccionado
            let currentPrice = priceMonthly;
            let billingLabel = "Facturado mensualmente";

            if (billingPeriod === "quarterly") {
              currentPrice = priceQuarterly / 3;
              billingLabel = `Facturado trimestralmente (${formatPrice(priceQuarterly)} / trimestre)`;
            } else if (billingPeriod === "yearly") {
              currentPrice = priceYearly / 12;
              billingLabel = `Facturado anualmente (${formatPrice(priceYearly)} / año)`;
            }

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 border shadow-md
                  ${isPro
                    ? "bg-[#8A1C14] dark:bg-red-950 text-white border-transparent lg:scale-105 lg:-translate-y-2 z-10 shadow-red-900/10 dark:shadow-black/25"
                    : "bg-white dark:bg-neutral-950/40 text-zinc-800 dark:text-zinc-100 border-zinc-100 dark:border-neutral-900"
                  }`}
              >
                {/* Popular Badge */}
                {isPro && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-black font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                    MÁS POPULAR
                  </div>
                )}

                {/* Card Top Information */}
                <div>
                  <h3 className={`text-2xl font-bold font-display ${isPro ? "text-white" : "text-neutral-900 dark:text-white"}`}>
                    {plan.nombre}
                  </h3>
                  <p className={`text-xs mt-1 font-semibold tracking-wide ${isPro ? "text-red-100/80" : "text-zinc-500 dark:text-zinc-400"}`}>
                    {plan.descripcion}
                  </p>

                  {/* Price Block */}
                  <div className="my-8">
                    <div>
                      {/* Original monthly price cut reference for savings display */}
                      <div className="flex items-center gap-2 h-6">
                        {billingPeriod !== "monthly" && (
                          <span className={`text-sm line-through ${isPro ? "text-red-200/50" : "text-zinc-400"}`}>
                            {formatPrice(priceMonthly)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-1 mt-1">
                        <span className={`text-4xl sm:text-5xl font-extrabold tracking-tight font-display ${isPro ? "text-white" : "text-neutral-900 dark:text-white"}`}>
                          {formatPrice(currentPrice)}
                        </span>
                        <span className={`text-xs font-light ${isPro ? "text-red-100/80" : "text-zinc-500 dark:text-zinc-400"}`}>
                          / {billingPeriod === "monthly" ? "mes" : "mes eq."}
                        </span>
                      </div>
                      
                      <p className={`text-[11px] font-semibold mt-1.5 ${isPro ? "text-emerald-300" : "text-emerald-600 dark:text-emerald-400"}`}>
                        {billingLabel}
                      </p>
                    </div>
                  </div>

                  {/* Features list (Only maximum residents is shown per user choice) */}
                  <ul className="space-y-4 my-8 border-t pt-8 border-zinc-100 dark:border-neutral-900/60 transition-colors">
                    <li className="flex items-start gap-3 text-sm">
                      <div className={`p-0.5 rounded-full mt-0.5 flex-shrink-0 ${isPro ? "bg-white/10 text-amber-300" : "bg-red-50 dark:bg-neutral-900 text-[#8A1C14] dark:text-red-400"}`}>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <span className={`font-semibold ${isPro ? "text-white/90" : "text-zinc-700 dark:text-zinc-200"}`}>
                        Hasta {plan.max_residentes} residentes
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Button actions bottom section */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => {
                      selectedPlanStore.set(plan.nombre);
                      const contactSection = document.getElementById("contacto");
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 shadow-sm
                      ${isPro
                        ? "bg-white hover:bg-zinc-100 text-[#8A1C14] active:scale-98"
                        : "bg-transparent hover:bg-red-50 dark:hover:bg-neutral-800/50 border border-[#8A1C14] dark:border-red-500/40 text-[#8A1C14] dark:text-red-400 active:scale-98"
                      }`}
                  >
                    Comenzar Ahora
                  </button>
                  {isPro && (
                    <p className="text-[11px] text-center text-red-100/70 font-light italic">
                      Sin permanencia. Cancela cuando quieras.
                    </p>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
