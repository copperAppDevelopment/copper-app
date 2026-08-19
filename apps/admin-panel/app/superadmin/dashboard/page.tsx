'use client';

import { useSuperAdminSession } from "@/hooks/useSuperAdminSession";
import { SuperAdminPageShell } from "@/components/layout/superadmin-page-shell";
import { useSuperAdminDashboard } from "@/features/superadmin/hooks/useSuperAdminDashboard";
import { SuperAdminKpis } from "@/features/superadmin/components/SuperAdminKpis";
import { UltimasSuscripciones } from "@/features/superadmin/components/UltimasSuscripciones";
import { AccesosRapidosSuperAdmin } from "@/features/superadmin/components/AccesosRapidosSuperAdmin";

export default function SuperAdminDashboard() {
  const sesion = useSuperAdminSession();
  const d = useSuperAdminDashboard(sesion.loading);

  return (
    <SuperAdminPageShell
      sesion={sesion}
      active="dashboard"
      loading={d.loading}
      titulo="Portal del SuperAdmin"
      subtitulo="Consola de administración global de Copper"
    >
      <SuperAdminKpis kpis={d.kpis} />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UltimasSuscripciones suscripciones={d.suscripciones} />
        </div>
        <AccesosRapidosSuperAdmin />
      </section>
    </SuperAdminPageShell>
  );
}
