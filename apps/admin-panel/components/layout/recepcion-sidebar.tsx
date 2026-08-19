'use client';

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DoorOpen, LogOut, RefreshCw } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { clearConjuntoSeleccionado } from "../../lib/conjunto";
import { Button } from "../ui/button";
import { ConfirmDialog } from "../ui/confirm-dialog";

export interface RecepcionSidebarProps {
  userEmail: string;
  hasMultipleConjuntos?: boolean;
}

/**
 * Sidebar del rol Recepción.
 *
 * Aparte del de administrador a propósito: aquel enlaza a Apartamentos, Recaudos o Mis
 * conjuntos —rutas a las que un recepcionista no puede entrar— y monta los modales de
 * cobros y comunicados, cuyos endpoints le responden 403 desde que la autorización mira el
 * rol. Aquí solo hay lo que de verdad puede usar.
 */
export function RecepcionSidebar({ userEmail, hasMultipleConjuntos = false }: RecepcionSidebarProps) {
  const router = useRouter();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const cerrarSesion = async () => {
    setLogoutLoading(true);
    await supabase.auth.signOut();
    localStorage.clear();
    setIsLogoutOpen(false);
    setLogoutLoading(false);
    router.push("/login");
  };

  return (
    <>
      <aside className="w-full md:w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-copper.webp" alt="Copper Logo" className="h-8 object-contain" />
          </div>

          <nav className="p-4 space-y-2">
            <span
              aria-current="page"
              className="flex items-center gap-3 bg-brand/10 text-brand px-4 py-3 rounded-xl text-sm font-semibold"
            >
              <DoorOpen className="w-5 h-5" />
              Recepción
            </span>
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
          {hasMultipleConjuntos && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                clearConjuntoSeleccionado();
                router.push("/select-conjunto");
              }}
              className="w-full justify-center"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Cambiar Conjunto
            </Button>
          )}

          <div className="flex items-center gap-2 p-2 -mx-2">
            <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center border border-brand/35 text-brand font-bold text-xs shrink-0">
              RE
            </div>
            <div className="truncate text-left">
              <p className="text-xs text-zinc-800 dark:text-white font-semibold truncate">{userEmail}</p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">RECEPCIÓN</p>
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={() => setIsLogoutOpen(true)}
            className="w-full justify-center"
            icon={<LogOut className="w-4 h-4" />}
          >
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      <ConfirmDialog
        isOpen={isLogoutOpen}
        title="¿Cerrar Sesión?"
        description="¿Estás seguro de que deseas salir de tu cuenta de Copper?"
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
        onConfirm={cerrarSesion}
        onCancel={() => setIsLogoutOpen(false)}
        variant="danger"
        loading={logoutLoading}
      />
    </>
  );
}
