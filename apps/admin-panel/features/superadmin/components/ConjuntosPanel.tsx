'use client';

import * as React from "react";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SpinnerPagina } from "@/components/ui/spinner";
import { useConjuntosSuper } from "../hooks/useConjuntosSuper";
import { ConjuntosKpis } from "./ConjuntosKpis";
import { ConjuntosTabla } from "./ConjuntosTabla";
import type { ConjuntoSuper } from "../types";

export function ConjuntosPanel({ sesionCargando }: { sesionCargando: boolean }) {
  const c = useConjuntosSuper(sesionCargando);
  const [porCambiar, setPorCambiar] = useState<ConjuntoSuper | null>(null);
  const [ocupado, setOcupado] = useState(false);

  if (c.loading) return <SpinnerPagina />;

  const confirmar = async () => {
    if (!porCambiar) return;
    setOcupado(true);
    await c.cambiarActivo(porCambiar, !porCambiar.activo);
    setOcupado(false);
    setPorCambiar(null);
  };

  const desactivando = Boolean(porCambiar?.activo);

  return (
    <div className="space-y-6">
      {c.error && <Alert variant="danger" onClose={() => c.setError("")}>{c.error}</Alert>}
      {c.aviso && <Alert variant="success" onClose={() => c.setAviso("")}>{c.aviso}</Alert>}

      <ConjuntosKpis {...c.contadores} />

      <div className="max-w-sm">
        <Input
          placeholder="Buscar por conjunto, ciudad o administrador"
          value={c.busqueda}
          onChange={e => {
            c.setBusqueda(e.target.value);
            c.tabla.reiniciarPagina();
          }}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      <ConjuntosTabla c={c} onCambiarActivo={setPorCambiar} />

      <ConfirmDialog
        isOpen={Boolean(porCambiar)}
        title={desactivando ? "¿Desactivar el conjunto?" : "¿Activar el conjunto?"}
        description={
          desactivando
            ? `Los ${porCambiar?.num_residentes ?? 0} residentes activos de ${porCambiar?.nombre_conjunto ?? ""} dejarán de poder usar la app de inmediato, también quienes la tengan abierta. Sus administradores conservan el acceso al panel.`
            : `${porCambiar?.nombre_conjunto ?? ""} vuelve a estar disponible y sus residentes recuperan el acceso.`
        }
        confirmText={desactivando ? "Desactivar" : "Activar"}
        cancelText="Cancelar"
        onConfirm={confirmar}
        onCancel={() => setPorCambiar(null)}
        variant={desactivando ? "danger" : "primary"}
        loading={ocupado}
      />
    </div>
  );
}
