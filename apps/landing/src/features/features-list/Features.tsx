import { UserCheck, BellRing, CreditCard, MessageSquare, LineChart, Building2, MessageCircle } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Perfil de Residente",
      description: "Centraliza la información de cada residente para una comunicación eficiente entre administradores y comunidad.",
      icon: UserCheck,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400"
    },
    {
      title: "Notificaciones Automatizadas",
      description: "Recibe alertas de visitas, envíos y recordatorios de pagos. Mantén informados a residentes y administradores de forma oportuna.",
      icon: BellRing,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400"
    },
    {
      title: "Intercomunicador Digital",
      description: "Control de visitantes, autorizaciones rápidas y comunicación interna en tiempo real entre residentes y portería.",
      icon: MessageSquare,
      color: "text-black bg-neutral-100 dark:bg-black/50 dark:text-white"
    },
    {
      title: "Gestión de Solicitudes",
      description: "Registra, canaliza y da seguimiento a solicitudes de mantenimiento, seguridad o convivencia.",
      icon: MessageCircle,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400"
    },
    {
      title: "Historial de Transacciones",
      description: "Transparencia financiera total. Generación de informes contables y consulta instantánea de estados de cuenta individuales.",
      icon: LineChart,
      color: "text-neutral-900 bg-neutral-100 dark:bg-neutral-950/65 dark:text-neutral-50"
    },
    {
      title: "Gestión Multiconjunto",
      description: "Administra varios conjuntos, torres o etapas desde un solo panel unificado. Diseñado para administradores profesionales.",
      icon: Building2,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400"
    }
  ];

  return (
    <section id="funciones" className="py-24 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-xs font-bold text-[#8A1C14] dark:text-red-500 uppercase tracking-widest mb-2">
            FUNCIONES DE LA APP
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-neutral-900 dark:text-white leading-tight">
            Todo para gestionar tu conjunto
          </h2>
          <div className="h-1 w-12 bg-[#8A1C14] dark:bg-red-500 mx-auto mt-4 rounded"></div>
          <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg mt-4 leading-relaxed font-light">
            Descubre las herramientas inteligentes que Copper App pone a tu disposición para simplificar la administración, elevar la recaudación y conectar comunidades.
          </p>
        </div>

        {/* Features Bento/Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, index) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={index}
                className="group relative p-8 bg-white dark:bg-neutral-950 rounded-3xl border border-zinc-100 dark:border-neutral-900 shadow-sm hover:shadow-md hover:border-[#8A1C14]/15 dark:hover:border-neutral-800 transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Background soft hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#8A1C14]/2 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  {/* Icon Wrapper */}
                  <div className={`p-4 rounded-2xl w-fit ${feat.color} transition-all duration-300 group-hover:scale-110`}>
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-[#8A1C14] dark:group-hover:text-red-400 transition-colors duration-200">
                      {feat.title}
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed font-light">
                      {feat.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
