'use client';

import * as React from "react";
import { SpinnerPagina } from "../ui/spinner";
import { MarcoConCajon } from "./marco-con-cajon";

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
 * Armazón de las páginas del panel: el sidebar (en cajón en pantallas angostas, ver
 * `MarcoConCajon`) y el encabezado de la página.
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
    <MarcoConCajon sidebar={sidebar}>
      {encabezado}

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white wrap-break-word">
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
    </MarcoConCajon>
  );
}
