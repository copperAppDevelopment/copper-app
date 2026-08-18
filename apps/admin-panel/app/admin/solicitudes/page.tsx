'use client';

import { useState } from "react";
import { useAdminSession } from "@/hooks/useAdminSession";
import { AdminPageShell } from "@/components/layout/admin-page-shell";
import { Alert } from "@/components/ui/alert";
import { useSolicitudes } from "@/features/solicitudes/hooks/useSolicitudes";
import { SolicitudesIndicadores } from "@/features/solicitudes/components/SolicitudesIndicadores";
import { SolicitudesTabla } from "@/features/solicitudes/components/SolicitudesTabla";
import { GestionarSolicitudModal } from "@/features/solicitudes/components/GestionarSolicitudModal";
import type { Solicitud } from "@/features/solicitudes/types";

export default function SolicitudesPage() {
  const sesion = useAdminSession();
  const s = useSolicitudes(sesion.conjuntoId, sesion.loading);

  const [enGestion, setEnGestion] = useState<Solicitud | null>(null);

  return (
    <AdminPageShell
      sesion={sesion}
      active="reportes"
      loading={s.loading}
      titulo="Solicitudes / PQRs"
      subtitulo={sesion.conjuntoNombre}
    >
      {s.error && <Alert variant="danger">{s.error}</Alert>}

      <SolicitudesIndicadores
        indicadores={s.indicadores}
        filtroEstado={s.filtroEstado}
        onEstadoChange={s.cambiarEstado}
      />

      <SolicitudesTabla
        tabla={s.tabla}
        filtro={s.filtro}
        onFiltroChange={s.cambiarFiltro}
        filtroEstado={s.filtroEstado}
        onEstadoChange={s.cambiarEstado}
        onGestionar={setEnGestion}
      />

      <GestionarSolicitudModal
        solicitud={enGestion}
        admins={s.admins}
        onClose={() => setEnGestion(null)}
        onGestionar={s.gestionar}
      />
    </AdminPageShell>
  );
}
