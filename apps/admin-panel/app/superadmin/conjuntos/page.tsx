'use client';

import { useSuperAdminSession } from "@/hooks/useSuperAdminSession";
import { SuperAdminPageShell } from "@/components/layout/superadmin-page-shell";
import { ConjuntosPanel } from "@/features/superadmin/components/ConjuntosPanel";

export default function SuperAdminConjuntosPage() {
  const sesion = useSuperAdminSession();

  return (
    <SuperAdminPageShell
      sesion={sesion}
      active="conjuntos"
      titulo="Conjuntos"
      subtitulo="Todas las copropiedades de la plataforma"
    >
      <ConjuntosPanel sesionCargando={sesion.loading} />
    </SuperAdminPageShell>
  );
}
