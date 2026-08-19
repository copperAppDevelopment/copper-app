'use client';

import * as React from "react";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAsignacionPlanes } from "../hooks/useAsignacionPlanes";
import { AsignacionTabla } from "./AsignacionTabla";
import { AsignarPlanModal } from "./AsignarPlanModal";
import type { FilaAsignacion } from "../types";

/** Asignación manual de planes: la vía para cortesías, demos y pagos por fuera de la pasarela. */
export function AsignacionPanel({ sesionCargando }: { sesionCargando: boolean }) {
  const a = useAsignacionPlanes(sesionCargando);
  const [enEdicion, setEnEdicion] = useState<FilaAsignacion | null>(null);
  const [porRevocar, setPorRevocar] = useState<FilaAsignacion | null>(null);
  const [revocando, setRevocando] = useState(false);

  const confirmarRevocar = async () => {
    if (!porRevocar) return;
    setRevocando(true);
    await a.revocar(porRevocar);
    setRevocando(false);
    setPorRevocar(null);
  };

  return (
    <div className="space-y-6">
      {a.error && <Alert variant="danger" onClose={() => a.setError("")}>{a.error}</Alert>}
      {a.aviso && <Alert variant="success" onClose={() => a.setAviso("")}>{a.aviso}</Alert>}

      <div className="max-w-sm">
        <Input
          placeholder="Buscar por conjunto, ciudad o administrador"
          value={a.busqueda}
          onChange={e => {
            a.setBusqueda(e.target.value);
            a.tabla.reiniciarPagina();
          }}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      <AsignacionTabla a={a} onAsignar={setEnEdicion} onRevocar={setPorRevocar} />

      <AsignarPlanModal
        isOpen={Boolean(enEdicion)}
        fila={enEdicion}
        onClose={() => setEnEdicion(null)}
        onAsignado={async (mensaje) => {
          a.setAviso(mensaje);
          await a.recargar();
        }}
      />

      <ConfirmDialog
        isOpen={Boolean(porRevocar)}
        title="¿Cortar la suscripción?"
        description={`La suscripción de ${porRevocar?.nombre_conjunto ?? ""} quedará vencida hoy mismo. No se borra el historial ni se deshabilita el conjunto, pero deja de estar al día.`}
        confirmText="Cortar suscripción"
        cancelText="Cancelar"
        onConfirm={confirmarRevocar}
        onCancel={() => setPorRevocar(null)}
        variant="danger"
        loading={revocando}
      />
    </div>
  );
}
