'use client';

import * as React from "react";
import { AdminSidebar, type AdminSection } from "./admin-sidebar";
import { SpinnerPagina } from "../ui/spinner";
import type { AdminSession } from "../../hooks/useAdminSession";

export interface AdminPageShellProps {
  sesion: AdminSession;
  active: AdminSection;
  /** Carga de los datos de la página; la de la sesión ya la contempla el shell. */
  loading?: boolean;
  titulo: string;
  /** Se muestra en línea junto al título (una insignia de estado, por ejemplo). */
  tituloAdorno?: React.ReactNode;
  subtitulo?: string;
  /** Botones de la esquina superior derecha. */
  acciones?: React.ReactNode;
  /** Encabezado alternativo (las páginas de detalle abren con un botón «Volver»). */
  encabezado?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Armazón común de las páginas de /admin: fondo, sidebar, main y encabezado.
 *
 * Estaba copiado sin variación en las seis páginas, y el spinner de carga en nueve.
 */
export function AdminPageShell({
  sesion,
  active,
  loading = false,
  titulo,
  tituloAdorno,
  subtitulo,
  acciones,
  encabezado,
  children,
}: AdminPageShellProps) {
  if (sesion.loading || loading) {
    return <SpinnerPagina />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-slate-950 text-zinc-900 dark:text-white flex flex-col md:flex-row">
      <AdminSidebar
        active={active}
        userEmail={sesion.userEmail}
        hasMultipleConjuntos={sesion.hasMultipleConjuntos}
      />

      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        {encabezado}

        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                {titulo}
              </h1>
              {tituloAdorno}
            </div>
            {subtitulo && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{subtitulo}</p>
            )}
          </div>

          {acciones && <div className="flex flex-wrap gap-3">{acciones}</div>}
        </header>

        {children}
      </main>
    </div>
  );
}
