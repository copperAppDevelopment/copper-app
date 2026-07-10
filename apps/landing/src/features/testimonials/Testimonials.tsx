import { Play, Star } from "lucide-react";
import { activeTestimonialStore } from "../../stores/appStore";
import type { Testimonial } from "../../types";

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      id: "laura",
      name: "Laura Martínez",
      role: "Administradora",
      location: "Torres del Norte - Bogotá",
      quote: "Redujimos el tiempo de gestión un 80%. Los residentes pagan en línea y ya no tenemos filas en la portería.",
      stars: 5,
      // Premium Unsplash images representing professionals
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=250",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120&h=120",
      stats: "Eficiencia: +80%"
    },
    {
      id: "jorge",
      name: "Jorge Herrera",
      role: "Propietario",
      location: "Conjunto Pinares - Medellín",
      quote: "Por fin puedo ver el estado de mi cuenta desde el celular. Copper App transformó nuestra copropiedad.",
      stars: 5,
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=250",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120&h=120",
      stats: "Pagos a término: 96%"
    },
    {
      id: "sandra",
      name: "Sandra Ríos",
      role: "Revisora Fiscal",
      location: "Agrupación El Bosque - Cali",
      quote: "La transparencia financiera es excepcional. El historial de transacciones me ahorra horas de auditoría.",
      stars: 5,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=250",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120&h=120",
      stats: "Auditorías: 3x rápidas"
    }
  ];

  return (
    <section id="testimonios" className="py-24 bg-[#8A1C14] dark:bg-red-950/80 transition-colors duration-500 relative">
      {/* Visual background details */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.15),transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-20 text-white">
          <p className="text-xs font-bold text-red-200 uppercase tracking-widest mb-2">
            TESTIMONIOS
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight">
            Lo que dicen nuestros clientes
          </h2>
          <div className="h-1 w-12 bg-white mx-auto mt-4 rounded opacity-80"></div>
        </div>

        {/* Video Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-red-950/20 dark:bg-black/25 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 hover:scale-102 transition-all duration-300 shadow-xl group cursor-pointer"
              onClick={() => activeTestimonialStore.set(test)}
            >
              {/* Horizontal Video Preview container */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={test.image}
                  alt={`Testimonio de ${test.name}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Dark premium overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-all duration-300" />
                
                {/* Video Title Indicator (YouTube style, top left) */}
                <div className="absolute top-4 left-4 z-10 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                  {test.name}
                </div>

                {/* Central Play button */}
                <div className="absolute inset-0 m-auto w-16 h-16 bg-[#8A1C14] hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-300 hover:scale-110 active:scale-95 group-hover:scale-105">
                  <Play className="w-7 h-7 fill-current translate-x-0.5 text-white" />
                </div>
                
                {/* Stats / Accent Pill (bottom right) */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-[10px] uppercase tracking-wider font-mono px-2.5 py-1 rounded backdrop-blur-sm">
                  {test.stats}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
