'use client';

import * as React from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, DollarSign, FileSpreadsheet, PieChart, LogOut, RefreshCw } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { clearConjuntoSeleccionado } from "../../lib/conjunto";
import { BotonInstalarApp } from "../pwa/BotonInstalarApp";

export interface ContadorSidebarProps {
  userEmail: string;
  hasMultipleConjuntos?: boolean;
}

/** Secciones que el menú anuncia pero que todavía no tienen pantalla: quedan inertes. */
const PROXIMAS = [
  { label: "Recaudo y Abonos", icon: <DollarSign className="w-5 h-5" /> },
  { label: "Facturación Mensual", icon: <FileSpreadsheet className="w-5 h-5" /> },
  { label: "Balances Financieros", icon: <PieChart className="w-5 h-5" /> },
];

/**
 * Sidebar del rol Contador. Conserva el tema oscuro fijo de su página, que todavía no se ha
 * migrado a `PageShell`.
 */
export function ContadorSidebar({ userEmail, hasMultipleConjuntos = false }: ContadorSidebarProps) {
  const router = useRouter();

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    router.push("/login");
  };

  const cambiarConjunto = () => {
    clearConjuntoSeleccionado();
    router.push("/select-conjunto");
  };

  return (
    <aside className="w-full h-full overflow-y-auto bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between text-white">
      <div>
        <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-copper.webp" alt="Copper Logo" className="h-8 object-contain" />
        </div>

        <nav className="p-4 space-y-2">
          <span
            aria-current="page"
            className="flex items-center gap-3 bg-brand/10 text-brand px-4 py-3 rounded-xl text-sm font-semibold"
          >
            <LayoutDashboard className="w-5 h-5" />
            Contabilidad
          </span>
          {PROXIMAS.map(item => (
            <span
              key={item.label}
              className="flex items-center gap-3 text-zinc-400 px-4 py-3 rounded-xl text-sm font-semibold"
            >
              {item.icon}
              {item.label}
            </span>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-zinc-800 space-y-3">
        {hasMultipleConjuntos && (
          <button
            onClick={cambiarConjunto}
            className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-300 hover:text-white py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Cambiar Conjunto
          </button>
        )}

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center border border-brand/35 text-brand font-bold text-xs shrink-0">
            CO
          </div>
          <div className="truncate text-left">
            <p className="text-xs text-white font-semibold truncate">{userEmail}</p>
            <p className="text-[10px] text-zinc-500 font-mono">CONTADOR PÚBLICO</p>
          </div>
        </div>

        <BotonInstalarApp />

        <button
          onClick={cerrarSesion}
          className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
