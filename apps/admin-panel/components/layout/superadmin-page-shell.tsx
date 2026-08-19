'use client';

import * as React from "react";
import { PageShell } from "./page-shell";
import { SuperAdminSidebar, type SuperAdminSection } from "./superadmin-sidebar";
import type { SesionSuperAdmin } from "../../hooks/useSuperAdminSession";

export interface SuperAdminPageShellProps {
  sesion: SesionSuperAdmin;
  active: SuperAdminSection;
  loading?: boolean;
  titulo: string;
  subtitulo?: string;
  acciones?: React.ReactNode;
  children: React.ReactNode;
}

/** Armazón de las páginas de /superadmin: el mismo `PageShell` con su propio sidebar. */
export function SuperAdminPageShell({
  sesion,
  active,
  loading = false,
  children,
  ...resto
}: SuperAdminPageShellProps) {
  return (
    <PageShell
      loading={sesion.loading || loading}
      sidebar={<SuperAdminSidebar active={active} userEmail={sesion.userEmail} />}
      {...resto}
    >
      {children}
    </PageShell>
  );
}
