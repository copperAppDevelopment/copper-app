'use client';

import * as React from "react";
import { PageShell } from "./page-shell";
import { RecepcionSidebar } from "./recepcion-sidebar";
import type { SesionPanel } from "../../hooks/useSesionPanel";

export interface RecepcionPageShellProps {
  sesion: SesionPanel;
  loading?: boolean;
  titulo: string;
  subtitulo?: string;
  acciones?: React.ReactNode;
  children: React.ReactNode;
}

/** Armazón de las páginas de /recepcion: el mismo `PageShell` con su propio sidebar. */
export function RecepcionPageShell({
  sesion,
  loading = false,
  children,
  ...resto
}: RecepcionPageShellProps) {
  return (
    <PageShell
      loading={sesion.loading || loading}
      sidebar={
        <RecepcionSidebar
          userEmail={sesion.userEmail}
          hasMultipleConjuntos={sesion.hasMultipleConjuntos}
        />
      }
      {...resto}
    >
      {children}
    </PageShell>
  );
}
