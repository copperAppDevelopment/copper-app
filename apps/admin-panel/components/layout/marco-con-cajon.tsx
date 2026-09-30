'use client';

import * as React from "react";
import { Menu, X } from "lucide-react";
import { useCajonMenu } from "../../hooks/useCajonMenu";

export interface MarcoConCajonProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  /** Fondo y color de texto de la página: el contador usa su propio tema oscuro. */
  className?: string;
  /** Fondo de la barra superior en móvil, a juego con el sidebar. */
  claseBarra?: string;
}

const ID_CAJON = "menu-lateral";

/**
 * Sidebar + contenido. Desde `lg` el sidebar queda fijo a la izquierda; por debajo se oculta en
 * un cajón que abre la hamburguesa de la barra superior.
 *
 * Los sidebars no saben si están en un cajón: el cierre al navegar lo resuelve
 * `useCajonMenu`, y sus modales salen por portal para que el `transform` del cajón no los recorte.
 */
export function MarcoConCajon({
  sidebar,
  children,
  className = "bg-zinc-50 dark:bg-slate-950 text-zinc-900 dark:text-white",
  claseBarra = "bg-white/90 dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800",
}: MarcoConCajonProps) {
  const { abierto, abrir, cerrar } = useCajonMenu();

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${className}`}>
      <header
        className={`lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 border-b backdrop-blur ${claseBarra}`}
      >
        <button
          type="button"
          onClick={abrir}
          aria-label="Abrir menú"
          aria-expanded={abierto}
          aria-controls={ID_CAJON}
          className="p-2 -ml-2 rounded-xl hover:bg-zinc-500/10 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-copper.webp" alt="Copper" className="h-6 object-contain" />
      </header>

      {abierto && (
        <div
          aria-hidden="true"
          onClick={cerrar}
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        />
      )}

      <div
        id={ID_CAJON}
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] shadow-2xl transition-[transform,visibility] duration-200 ${
          abierto ? "translate-x-0 visible" : "-translate-x-full invisible"
        } lg:sticky lg:top-0 lg:bottom-auto lg:z-auto lg:h-screen lg:w-64 lg:shrink-0 lg:shadow-none lg:translate-x-0 lg:visible`}
      >
        {sidebar}
        <button
          type="button"
          onClick={cerrar}
          aria-label="Cerrar menú"
          className="lg:hidden absolute top-4 right-3 p-2 rounded-xl text-zinc-400 hover:bg-zinc-500/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 space-y-8">{children}</main>
    </div>
  );
}
