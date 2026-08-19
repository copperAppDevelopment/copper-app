'use client';

import { useSuperAdminSession } from "@/hooks/useSuperAdminSession";
import { SuperAdminPageShell } from "@/components/layout/superadmin-page-shell";
import { AsignacionPanel } from "@/features/superadmin/components/AsignacionPanel";

export default function SuperAdminSuscripcionesPage() {
  const sesion = useSuperAdminSession();

  return (
    <SuperAdminPageShell
      sesion={sesion}
      active="suscripciones"
      titulo="Asignación de planes"
      subtitulo="Da o cambia el plan de un conjunto sin pasar por la pasarela de pago"
    >
      <AsignacionPanel sesionCargando={sesion.loading} />
    </SuperAdminPageShell>
  );
}
