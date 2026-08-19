'use client';

import * as React from "react";
import { SpinnerPagina } from "../ui/spinner";

export interface PageShellProps {
  /** El sidebar del rol: el del administrador o el de recepción. */
  sidebar: React.ReactNode;
  /** Carga de la sesión o de los datos de la página. */
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
 * Armazón de las páginas del panel: fondo, sidebar, main y encabezado.
 *
 * El sidebar entra por prop en vez de estar fijado porque recepción necesita el suyo:
 * `AdminSidebar` enlaza a rutas donde un recepcionista no puede entrar y monta los modales
 * de cobros y comunicados, cuyos endpoints le responden 403.
 */
export function PageShell({
  sidebar,
  loading = false,
  titulo,
  tituloAdorno,
  subtitulo,
  acciones,
  encabezado,
  children,
}: PageShellProps) {
  if (loading) {
    return <SpinnerPagina />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-slate-950 text-zinc-900 dark:text-white flex flex-col md:flex-row">
      {sidebar}

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
