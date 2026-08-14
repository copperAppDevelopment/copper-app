'use client';

import { useState } from "react";
import { UserPlus, Info } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";
import { AdminPageShell } from "@/components/layout/admin-page-shell";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useResidentes } from "@/features/residentes/hooks/useResidentes";
import { ResidentesIndicadores } from "@/features/residentes/components/ResidentesIndicadores";
import { ResidentesTabla } from "@/features/residentes/components/ResidentesTabla";
import { InvitarResidenteModal } from "@/features/residentes/components/InvitarResidenteModal";
import { AsignarApartamentoModal } from "@/features/residentes/components/AsignarApartamentoModal";
import type { Residente } from "@/features/residentes/types";

export default function ResidentesPage() {
  const sesion = useAdminSession();
  const r = useResidentes(sesion.conjuntoId, sesion.loading);

  const [invitarAbierto, setInvitarAbierto] = useState(false);
  const [asignarTarget, setAsignarTarget] = useState<Residente | null>(null);
  const [removerTarget, setRemoverTarget] = useState<Residente | null>(null);
  const [removerLoading, setRemoverLoading] = useState(false);

  const confirmarRemover = async () => {
    if (!removerTarget) return;
    setRemoverLoading(true);
    try {
      await r.remover(removerTarget.residente_id);
    } catch (err: any) {
      r.setError(err.message);
    } finally {
      setRemoverTarget(null);
      setRemoverLoading(false);
    }
  };

  const { pendientes } = r.indicadores;

  return (
    <AdminPageShell
      sesion={sesion}
      active="residentes"
      loading={r.loading}
      titulo="Residentes"
      subtitulo={sesion.conjuntoNombre}
      acciones={
        <Button icon={<UserPlus className="w-4 h-4" />} onClick={() => setInvitarAbierto(true)}>
          Invitar residente
        </Button>
      }
    >
      {r.error && <Alert variant="danger">{r.error}</Alert>}

      {pendientes > 0 && (
        <p className="flex items-start gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          <Info className="w-3.5 h-3.5 shrink-0 mt-px" />
          {pendientes === 1
            ? "Hay 1 residente sin apartamento asignado. Quien se registra desde la app móvil queda así hasta que un administrador le asigne uno."
            : `Hay ${pendientes} residentes sin apartamento asignado. Quien se registra desde la app móvil queda así hasta que un administrador le asigne uno.`}
        </p>
      )}

      <ResidentesIndicadores {...r.indicadores} conjuntoNombre={sesion.conjuntoNombre} />

      <ResidentesTabla
        tabla={r.tabla}
        filtro={r.filtro}
        onFiltroChange={r.cambiarFiltro}
        filtroEstado={r.filtroEstado}
        onEstadoChange={r.cambiarEstado}
        onAsignar={setAsignarTarget}
        onRemover={setRemoverTarget}
      />

      <InvitarResidenteModal
        isOpen={invitarAbierto}
        onClose={() => setInvitarAbierto(false)}
        conjuntoNombre={sesion.conjuntoNombre}
        opcionesApartamento={r.opcionesApartamento}
        onInvitar={r.invitar}
        onVincular={r.vincular}
      />

      <AsignarApartamentoModal
        residente={asignarTarget}
        onClose={() => setAsignarTarget(null)}
        opcionesApartamento={r.opcionesApartamento}
        onAsignar={r.asignar}
      />

      <ConfirmDialog
        isOpen={Boolean(removerTarget)}
        title="¿Remover del apartamento?"
        description={`${removerTarget?.nombre_completo?.trim() || "El residente"} dejará de figurar como habitante del apartamento ${removerTarget?.apartamento_numero ?? ""}. El registro se conserva y seguirá visible en el historial del apartamento.`}
        confirmText="Remover"
        cancelText="Cancelar"
        onConfirm={confirmarRemover}
        onCancel={() => setRemoverTarget(null)}
        variant="danger"
        loading={removerLoading}
      />
    </AdminPageShell>
  );
}
