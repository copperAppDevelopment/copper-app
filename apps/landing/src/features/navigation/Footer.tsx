import Logo from "./Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-zinc-400 border-t border-neutral-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Footer Top Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Logo Brand Descriptor */}
          <div className="md:col-span-6 space-y-6">
            <a href="#" className="inline-block">
              <Logo />
            </a>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed font-light">
              La solución integral para la gestión eficiente de conjuntos residenciales y copropiedades en Colombia.
            </p>
          </div>

          {/* Product columns */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-neutral-100 uppercase tracking-widest">
              Producto
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#funciones" className="hover:text-white transition-colors">
                  Funciones
                </a>
              </li>
              <li>
                <a href="#beneficios" className="hover:text-white transition-colors">
                  Beneficios
                </a>
              </li>
              <li>
                <a href="#precios" className="hover:text-white transition-colors">
                  Precios
                </a>
              </li>
              <li>
                <a href="#simulador" className="hover:text-[#8A1C14] dark:hover:text-red-400 transition-colors">
                  Simulador de Impacto
                </a>
              </li>
            </ul>
          </div>

          {/* Contact columns */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-neutral-100 uppercase tracking-widest">
              Contáctanos
            </h4>
            <ul className="space-y-2.5 text-sm font-light">
              <li>
                <a href="mailto:info@copperapp.co" className="hover:text-white transition-colors font-semibold">
                  info@copperapp.co
                </a>
              </li>
              <li>
                <a href="tel:+573173689836" className="hover:text-white transition-colors font-semibold">
                  +57 317-368-9836
                </a>
              </li>
              <li>
                <span className="text-xs uppercase tracking-wider text-zinc-650 block pt-1 font-bold">
                  Ubicación
                </span>
                <span>Bogotá / Medellín / Cali, Colombia</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom copyright block */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-semibold tracking-wide text-zinc-500">
          <p>
            © {currentYear} Copper App. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-350 transition-colors">
              Términos
            </a>
            <a href="#" className="hover:text-zinc-350 transition-colors">
              Privacidad
            </a>
            <a href="#" className="hover:text-zinc-350 transition-colors">
              Política de datos
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
