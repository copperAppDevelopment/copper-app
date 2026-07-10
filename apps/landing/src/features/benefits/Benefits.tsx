import { useState, useEffect, useRef } from "react";
import {
  Smartphone,
  Laptop,
  CheckCircle2,
  X,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  ChevronRight,
  Database
} from "lucide-react";

interface SaasModule {
  id: number;
  title: string;
  tag: "Web + App" | "Solo App" | "Solo Web";
  shortDesc: string;
  longDesc: string;
  image: string;
  features: string[];
  role: "inquilinos" | "administrativos" | "ambos";
}

export default function Benefits() {
  const [selectedModule, setSelectedModule] = useState<SaasModule | null>(null);
  const [activeTab, setActiveTab] = useState<"todos" | "inquilinos" | "administrativos">("todos");

  const modules: SaasModule[] = [
    {
      id: 1,
      title: "Finanzas & Recaudo Automatizado",
      tag: "Web + App",
      shortDesc: "Conciliación bancaria con un solo clic y pasarela de pagos integrada para copropietarios.",
      longDesc: "Simplifica el recaudo mensual de expensas y cuotas extraordinarias. Los administradores controlan la conciliación en tiempo real en la Web, mientras que los copropietarios pagan al instante desde su celuar sin salir de casa.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=500",
      features: [
        "Pagos seguros con PSE, tarjetas de crédito y débito",
        "Generación automática de estados de cuenta mensuales",
        "Conciliación inteligente en lote para el administrador",
        "Recordatorios push automáticos de cobros pendientes"
      ],
      role: "ambos"
    },
    {
      id: 2,
      title: "Control de Acceso & Visitantes QR",
      tag: "Solo App",
      shortDesc: "Pre-autorizaciones dinámicas por código QR para agilizar ingresos en portería.",
      longDesc: "Los copropietarios no necesitan llamar a portería ni llenar planillas. Crean invitaciones pre-aprobadas de forma digital para familiares, amigos o domicilios. En portería solo escanean y se registra de inmediato con total seguridad.",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800&h=500",
      features: [
        "Envío directo de códigos QR por WhatsApp a visitas",
        "Historial automatizado e inmutable de ingresos a la copropiedad",
        "Alertas push instantáneas cuando el visitante ingresa",
        "Gestión unificada compatible con tablets en portería"
      ],
      role: "inquilinos"
    },
    {
      id: 3,
      title: "Reservas de Zonas Comunes",
      tag: "Web + App",
      shortDesc: "Disponibilidad transparente y reservas de zonas sociales sin conflictos de horarios.",
      longDesc: "Garantiza un uso justo del Salón Social, BBQ, Canchas, Piscina o Gimnasio. Los residentes reservan en segundos desde su móvil, acreditando pagos si aplica, y la administración regula las políticas de uso desde la plataforma web centralizada.",
      image: "https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&q=80&w=800&h=500",
      features: [
        "Calendario inteligente en tiempo real para cohabitantes",
        "Configuración flexible de horarios y aforos por la administración",
        "Carga automática del costo de reserva a la factura mensual",
        "Cancelaciones automatizadas para liberar espacios en desuso"
      ],
      role: "ambos"
    },
    {
      id: 4,
      title: "Gestión Remota de PQRS & Comunicados",
      tag: "Web + App",
      shortDesc: "Radicación digital de PQRs con estados de avance y muro oficial de anuncios.",
      longDesc: "Elimina los papeles en portería y los chats informales. Radica inconformidades, daños o solicitudes desde la app y sigue su proceso en tiempo real. La administración asigna responsables, responde con trazabilidad y publica comunicados oficiales directamente.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800&h=500",
      features: [
        "Radicación con soporte fotográfico directo en el celular",
        "Canal oficial con alertas push a toda la comunidad en segundos",
        "Consola de despacho para contratistas/técnicos de mantenimiento",
        "Encuestas digitales y votaciones no presenciales integradas"
      ],
      role: "ambos"
    },
    {
      id: 5,
      title: "Portería & Correspondencia Digital",
      tag: "Solo Web",
      shortDesc: "Registro unificado de encomiendas con aviso y firma digital de recepción.",
      longDesc: "Una solución optimizada para vigilantes y personal de recepción. Registra de forma rápida paquetes o correspondencia. Al momento de guardar la entrada, el residente recibe un aviso visual en su pantalla notificándole la entrega.",
      image: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=800&h=500",
      features: [
        "Carga express con interfaz adaptada a tablets de portería",
        "Avisos visuales push automáticos sobre la correspondencia",
        "Bitácora digitalizada de turnos de vigilancia y novedades",
        "Botón de pánico integrado para emergencias dentro del conjunto"
      ],
      role: "administrativos"
    }
  ];

  // Filter modules based on selected tab view
  const filteredModules = modules.filter(mod => {
    if (activeTab === "todos") return true;
    if (activeTab === "inquilinos") return mod.role === "inquilinos" || mod.role === "ambos";
    if (activeTab === "administrativos") return mod.role === "administrativos" || mod.role === "ambos";
    return true;
  });

  // Duplicate for seamless infinite loop marquee
  const doubleModules = [...filteredModules, ...filteredModules, ...filteredModules];

  return (
    <section id="beneficios" className="py-24 bg-neutral-50 dark:bg-black overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Section Header Text and Dynamic Quick Filter Tabs */}
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#8A1C14] dark:text-red-500 uppercase tracking-widest">
              SISTEMA INTEGRAL SAAS
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Módulos del Sistema SaaS de Copper
            </h2>
            <div className="h-1.5 w-24 bg-[#8A1C14] dark:bg-red-600 mx-auto rounded-full mt-4" />
          </div>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
            Navega por las distintas soluciones que ofrece nuestro software en la nube. Haz un clic en cualquier módulo para ver la descripción técnica ampliada, screenshots de la plataforma y funcionalidades integradas.
          </p>

          {/* Elegant Filter Buttons */}
          <div className="inline-flex p-1.5 bg-zinc-100 dark:bg-neutral-900 border border-zinc-200/50 dark:border-neutral-800 rounded-2xl gap-1">
            <button
              onClick={() => setActiveTab("todos")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTab === "todos"
                ? "bg-[#8A1C14] text-white shadow-md shadow-red-900/10"
                : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
            >
              Todos los Módulos
            </button>
            <button
              onClick={() => setActiveTab("inquilinos")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTab === "inquilinos"
                ? "bg-[#8A1C14] text-white shadow-md shadow-red-900/10"
                : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
            >
              App Inquilinos
            </button>
            <button
              onClick={() => setActiveTab("administrativos")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTab === "administrativos"
                ? "bg-[#8A1C14] text-white shadow-md shadow-red-900/10"
                : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
            >
              Portal Administrativo
            </button>
          </div>
        </div>

        {/* --- INFINITE SCROLLING MARQUEE (Right to Left) --- */}
        <div className="relative w-full overflow-hidden py-4 select-none">
          {/* Subtle gradient overlay to fade edges beautifully on desktop */}
          <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-neutral-50 to-transparent dark:from-black z-10 pointer-events-none hidden sm:block" />
          <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-neutral-50 to-transparent dark:from-black z-10 pointer-events-none hidden sm:block" />

          {/* Marquee Inner Scroller running right-to-left */}
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-33.333%); }
            }
            .animate-marquee {
              animation: marquee 35s linear infinite;
            }
            .animate-marquee:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="flex gap-6 w-max animate-marquee">
            {doubleModules.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => setSelectedModule(item)}
                className="w-[280px] sm:w-[320px] shrink-0 bg-white dark:bg-neutral-950 border border-zinc-100 dark:border-neutral-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-red-500/30 dark:hover:border-red-500/30 transition-all duration-300 cursor-pointer group"
              >
                {/* Image Showcase */}
                <div className="relative aspect-video overflow-hidden bg-zinc-100 dark:bg-neutral-950">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Floating SaaS platform badge */}
                  <span className="absolute top-3 right-3 bg-white/95 dark:bg-black/90 text-zinc-800 dark:text-red-400 font-bold font-mono text-[9px] uppercase tracking-wider px-2 py-1 rounded-full shadow-sm">
                    {item.tag}
                  </span>
                </div>

                {/* Info Text Body */}
                <div className="p-5 space-y-3">
                  <h3 className="font-display font-bold text-sm sm:text-base text-[#8A1C14] dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light line-clamp-2 leading-relaxed">
                    {item.shortDesc}
                  </p>

                  {/* Interactive Button Anchor */}
                  <div className="flex items-center gap-1.5 text-xs text-[#8A1C14] dark:text-red-400 font-bold pt-1">
                    <span>Explorar módulo</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- COMPARATIVE PLATFORM SERVICES DETAILS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">

          {/* Card 1: INQUILINOS / RESIDENTS APP SPECIFICATIONS */}
          <div className="bg-zinc-50/50 dark:bg-neutral-950/20 border border-zinc-200/45 dark:border-neutral-900/40 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex p-3 bg-red-100 dark:bg-red-950/40 text-[#8A1C14] dark:text-red-400 rounded-2.5xl">
                <Smartphone className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="text-left space-y-2">
                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-neutral-900 dark:text-white">
                  App para Inquilinos & Residentes
                </h3>
                <p className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-widest font-mono">
                  Optimizado para iOS y Android
                </p>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm font-light leading-relaxed text-left">
                Brinda una experiencia móvil inigualable a todos los cohabitantes de la copropiedad. Los residentes tienen el control de su apartamento en el bolsillo, eliminando canales impersonales de correspondencia y filas interminables.
              </p>

              {/* Resident Specs Checkpoints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
                {[
                  "Pagos mediante link de pago",
                  "Radicación ágil de PQRs",
                  "Registro mediante QR",
                  "Notificaciones de encomiendas",
                  "Chat en línea con soporte de administración"
                ].map((spec, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-2 text-xs text-zinc-800 dark:text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100 dark:fill-emerald-950 shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200/50 dark:border-neutral-900/50 flex justify-between items-center text-xs">
              <span className="text-zinc-400">Instalación express</span>
              <span className="text-[#8A1C14] font-bold font-mono dark:text-red-400">Código personal por residente</span>
            </div>
          </div>

          {/* Card 2: PORTAL WEB PARA LOS ADMINISTRATIVOS */}
          <div className="bg-zinc-50/50 dark:bg-neutral-950/20 border border-zinc-200/45 dark:border-neutral-900/40 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex p-3 bg-red-100 dark:bg-red-950/40 text-[#8A1C14] dark:text-red-400 rounded-2.5xl">
                <Laptop className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="text-left space-y-2">
                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-neutral-900 dark:text-white">
                  Portal Administrativo Web
                </h3>
                <p className="text-xs font-semibold text-zinc-500 dark:text-red-400 uppercase tracking-widest font-mono">
                  Acceso en la Nube desde tu PC
                </p>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm font-light leading-relaxed text-left">
                La central de comando diseñada específicamente para administradores generales, consejos residenciales y contadores. Automatiza las horas operativas y obtén reportes contables con altos estándares de precisión de forma digital.
              </p>

              {/* Admin Specs Checkpoints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
                {[
                  "Conciliación bancaria automatizada",
                  "Reportes financieros en un clic",
                  "Envío masivo de comunicados",
                  "Gestión contable e historial de caja",
                  "Control central de encomiendas",
                  "Monitoreo de PQRs asignadas"
                ].map((spec, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-2 text-xs text-zinc-800 dark:text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100 dark:fill-emerald-950 shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200/50 dark:border-neutral-900/50 flex justify-between items-center text-xs">
              <span className="text-zinc-400">Trazabilidad total</span>
              <span className="text-[#8A1C14] font-bold font-mono dark:text-red-400">Seguridad SSL y backups en la nube</span>
            </div>
          </div>

        </div>

      </div>

      {/* --- PREMIUM PORTAL MODAL / LIGHTBOX FOR MODULE DETAIL VIEW --- */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md transition-opacity">

          <div
            className="relative bg-white dark:bg-neutral-950 border border-zinc-100 dark:border-neutral-900 max-w-2xl w-full rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-250 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Exit Button */}
            <button
              onClick={() => setSelectedModule(null)}
              className="absolute top-4 right-4 z-40 p-2 text-white bg-black/60 rounded-full hover:bg-black/80 transition-colors shadow-md cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Scrollable Content Container */}
            <div className="overflow-y-auto flex-1">

              {/* Hero Image Showcase */}
              <div className="relative aspect-[16/9] w-full bg-zinc-100 dark:bg-black">
                <img
                  src={selectedModule.image}
                  alt={selectedModule.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                {/* Overlay Text inside picture */}
                <div className="absolute bottom-6 left-6 right-6 space-y-1.5 text-left">
                  <span className="bg-[#8A1C14] text-white font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-md">
                    {selectedModule.tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                    {selectedModule.title}
                  </h3>
                </div>
              </div>

              {/* Technical Description Specification Info */}
              <div className="p-6 sm:p-8 space-y-6 text-left">

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">
                    Descripción del Módulo
                  </h4>
                  <p className="text-zinc-650 dark:text-zinc-300 text-sm font-light leading-relaxed">
                    {selectedModule.longDesc}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">
                    Funcionalidades Clave
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {selectedModule.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100 dark:fill-emerald-950 shrink-0 mt-0.5" />
                        <span className="text-xs text-zinc-700 dark:text-zinc-200 font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Bottom Action Status Bar */}
            <div className="p-5 bg-zinc-50 dark:bg-black border-t border-zinc-100 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Database className="w-4 h-4 text-red-500" />
                <span>Base de datos sincronizada en tiempo real</span>
              </div>
              <button
                onClick={() => {
                  setSelectedModule(null);
                  const contactEl = document.getElementById("contacto");
                  if (contactEl) {
                    contactEl.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="w-full sm:w-auto bg-[#8A1C14] hover:bg-red-800 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Solicitar Demostración de este Módulo
              </button>
            </div>

          </div>

        </div>
      )}

    </section>
  );
}
