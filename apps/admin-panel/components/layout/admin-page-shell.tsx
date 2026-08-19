'use client';

import * as React from "react";
import { AdminSidebar, type AdminSection } from "./admin-sidebar";
import { PageShell } from "./page-shell";
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
 * Armazón de las páginas de /admin. Lo común vive en `PageShell`; esto solo le pone el
 * sidebar del administrador y traduce la sesión.
 */
export function AdminPageShell({
  sesion,
  active,
  loading = false,
  children,
  ...resto
}: AdminPageShellProps) {
  return (
    <PageShell
      loading={sesion.loading || loading}
      sidebar={
        <AdminSidebar
          active={active}
          userEmail={sesion.userEmail}
          conjuntoId={sesion.conjuntoId}
          conjuntoNombre={sesion.conjuntoNombre}
          hasMultipleConjuntos={sesion.hasMultipleConjuntos}
        />
      }
      {...resto}
    >
      {children}
    </PageShell>
  );
}
