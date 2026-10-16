'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";
import { AdminPageShell } from "@/components/layout/admin-page-shell";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { useInvitaciones } from "@/features/invitaciones/hooks/useInvitaciones";
import { InvitacionesTabla } from "@/features/invitaciones/components/InvitacionesTabla";
import { InvitarVariosModal } from "@/features/invitaciones/components/InvitarVariosModal";

export default function InvitacionesPage() {
  const router = useRouter();
  const sesion = useAdminSession();
  const inv = useInvitaciones(sesion.conjuntoId, sesion.loading);
  const [masivoAbierto, setMasivoAbierto] = useState(false);

  const resumen = [
    `${inv.conteo.pendiente} pendientes`,
    inv.conteo.vencida ? `${inv.conteo.vencida} vencidas` : null,
    inv.conteo.error ? `${inv.conteo.error} con error` : null,
    `${inv.conteo.aceptada} aceptadas`,
  ].filter(Boolean).join(" · ");

  return (
    <AdminPageShell
      sesion={sesion}
      active="residentes"
      loading={inv.loading}
      titulo="Invitaciones"
      subtitulo={[sesion.conjuntoNombre?.trim(), inv.total ? resumen : null].filter(Boolean).join(" · ")}
      encabezado={
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.push("/admin/residentes")}
          className="-ml-3"
        >
          Volver a residentes
        </Button>
      }
      acciones={
        <Button icon={<Users className="w-4 h-4" />} onClick={() => setMasivoAbierto(true)}>
          Invitar varios
        </Button>
      }
    >
      {inv.error && <Alert variant="danger">{inv.error}</Alert>}
      {inv.aviso && <Alert variant="success">{inv.aviso}</Alert>}

      <InvitacionesTabla
        tabla={inv.tabla}
        filtro={inv.filtro}
        onFiltroChange={inv.cambiarFiltro}
        filtroEstado={inv.filtroEstado}
        onEstadoChange={inv.cambiarEstado}
        onReenviar={inv.reenviar}
        operandoId={inv.operandoId}
      />

      <InvitarVariosModal
        isOpen={masivoAbierto}
        onClose={() => setMasivoAbierto(false)}
        conjuntoId={sesion.conjuntoId}
        conjuntoNombre={sesion.conjuntoNombre}
        onEnviado={inv.recargar}
      />
    </AdminPageShell>
  );
}
