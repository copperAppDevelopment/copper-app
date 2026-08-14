'use client';

import { useAdminSession } from "@/hooks/useAdminSession";
import { AdminPageShell } from "@/components/layout/admin-page-shell";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { DashboardKpis } from "@/features/dashboard/components/DashboardKpis";
import { SolicitudesTabla } from "@/features/dashboard/components/SolicitudesTabla";
import { AccesosRapidos } from "@/features/dashboard/components/AccesosRapidos";

export default function AdminDashboard() {
  const sesion = useAdminSession();
  const d = useDashboard(sesion.conjuntoId, sesion.loading);

  return (
    <AdminPageShell
      sesion={sesion}
      active="dashboard"
      loading={d.loading}
      titulo={sesion.conjuntoNombre}
      subtitulo="Portal del Administrador de la Copropiedad"
    >
      <DashboardKpis kpis={d.kpis} />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SolicitudesTabla tabla={d.tabla} />
        </div>
        <AccesosRapidos />
      </section>
    </AdminPageShell>
  );
}
