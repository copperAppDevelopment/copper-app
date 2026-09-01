'use client';

import { useState } from "react";
import { useAdminSession } from "@/hooks/useAdminSession";
import { AdminPageShell } from "@/components/layout/admin-page-shell";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { DashboardKpis } from "@/features/dashboard/components/DashboardKpis";
import { ChecklistOnboarding } from "@/features/dashboard/components/ChecklistOnboarding";
import { SolicitudesTabla } from "@/features/dashboard/components/SolicitudesTabla";
import { AccesosRapidos } from "@/features/dashboard/components/AccesosRapidos";
import { GenerarComunicadoModal } from "@/features/comunicados/components/GenerarComunicadoModal";
import { CrearApartamentoModal } from "@/features/apartamentos/components/CrearApartamentoModal";
import { useCrearApartamento } from "@/features/apartamentos/hooks/useCrearApartamento";

/** Modales que abren las operaciones del panel de accesos rápidos. */
type ModalDashboard = "comunicado" | "apartamento";

export default function AdminDashboard() {
  const sesion = useAdminSession();
  const d = useDashboard(sesion.conjuntoId, sesion.loading);

  // Los modales se montan aquí y no dentro de `AccesosRapidos` porque son de otras dos
  // features y una feature no importa de otra. Un único valor, como en el sidebar, para que
  // no puedan abrirse dos a la vez.
  const [modalAbierto, setModalAbierto] = useState<ModalDashboard | null>(null);
  const apt = useCrearApartamento(sesion.conjuntoId, modalAbierto === "apartamento");

  return (
    <AdminPageShell
      sesion={sesion}
      active="dashboard"
      loading={d.loading}
      titulo={sesion.conjuntoNombre}
      subtitulo="Portal del Administrador de la Copropiedad"
    >
      <ChecklistOnboarding kpis={d.kpis} pendientes={d.pendientes} />

      <DashboardKpis kpis={d.kpis} />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SolicitudesTabla tabla={d.tabla} />
        </div>
        <AccesosRapidos
          onEnviarComunicado={() => setModalAbierto("comunicado")}
          onRegistrarApartamento={() => setModalAbierto("apartamento")}
        />
      </section>

      <GenerarComunicadoModal
        isOpen={modalAbierto === "comunicado"}
        onClose={() => setModalAbierto(null)}
        conjuntoId={sesion.conjuntoId}
        conjuntoNombre={sesion.conjuntoNombre}
      />

      <CrearApartamentoModal
        isOpen={modalAbierto === "apartamento"}
        onClose={() => setModalAbierto(null)}
        conjuntoNombre={sesion.conjuntoNombre ?? "tu conjunto"}
        torres={apt.torres}
        // Recarga los KPIs: si no, la lista de tareas seguiría pidiendo crear apartamentos
        // justo después de haber creado uno desde aquí.
        onCrear={async (payload) => { await apt.crear(payload); await d.recargar(); }}
      />
    </AdminPageShell>
  );
}
