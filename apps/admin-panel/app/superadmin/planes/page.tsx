'use client';

import { useSuperAdminSession } from "@/hooks/useSuperAdminSession";
import { SuperAdminPageShell } from "@/components/layout/superadmin-page-shell";
import { PlanesPanel } from "@/features/superadmin/components/PlanesPanel";

export default function SuperAdminPlanesPage() {
  const sesion = useSuperAdminSession();

  return (
    <SuperAdminPageShell
      sesion={sesion}
      active="planes"
      titulo="Planes"
      subtitulo="Planes comerciales de Copper y sus precios"
    >
      <PlanesPanel sesionCargando={sesion.loading} />
    </SuperAdminPageShell>
  );
}
