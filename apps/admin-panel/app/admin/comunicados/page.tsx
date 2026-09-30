'use client';

import { useState } from "react";
import { Plus } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";
import { AdminPageShell } from "@/components/layout/admin-page-shell";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useComunicados } from "@/features/comunicados/hooks/useComunicados";
import { ComunicadosTabla } from "@/features/comunicados/components/ComunicadosTabla";
import { DetalleComunicadoModal } from "@/features/comunicados/components/DetalleComunicadoModal";
import { GenerarComunicadoModal } from "@/features/comunicados/components/GenerarComunicadoModal";
import type { Comunicado } from "@/features/comunicados/types";

export default function ComunicadosPage() {
  const sesion = useAdminSession();
  const c = useComunicados(sesion.conjuntoId, sesion.loading);

  const [creando, setCreando] = useState(false);
  const [viendo, setViendo] = useState<Comunicado | null>(null);
  const [porEliminar, setPorEliminar] = useState<Comunicado | null>(null);

  // El modal publica por su cuenta: al cerrarlo, la tabla puede haber quedado vieja.
  const cerrarCreacion = () => {
    setCreando(false);
    c.recargar();
  };

  const confirmarEliminar = async () => {
    if (porEliminar) await c.eliminar(porEliminar.id);
    setPorEliminar(null);
  };

  return (
    <AdminPageShell
      sesion={sesion}
      active="comunicados"
      loading={c.loading}
      titulo="Comunicados"
      subtitulo={sesion.conjuntoNombre}
      acciones={
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setCreando(true)}>
          Nuevo comunicado
        </Button>
      }
    >
      {c.error && <Alert variant="danger">{c.error}</Alert>}

      <ComunicadosTabla
        tabla={c.tabla}
        filtro={c.filtro}
        onFiltroChange={c.cambiarFiltro}
        filtroTipo={c.filtroTipo}
        onTipoChange={c.cambiarTipo}
        filtroNovedad={c.filtroNovedad}
        onNovedadChange={c.cambiarNovedad}
        onVer={setViendo}
        onEliminar={setPorEliminar}
        operandoId={c.operandoId}
      />

      <DetalleComunicadoModal
        comunicado={viendo}
        onClose={() => setViendo(null)}
        onAbrirAdjunto={c.abrirAdjunto}
      />

      <GenerarComunicadoModal
        isOpen={creando}
        onClose={cerrarCreacion}
        conjuntoId={sesion.conjuntoId}
        conjuntoNombre={sesion.conjuntoNombre}
      />

      <ConfirmDialog
        isOpen={Boolean(porEliminar)}
        title="¿Eliminar el comunicado?"
        description={
          porEliminar
            ? `«${porEliminar.titulo}» desaparece del historial y de la app de los residentes, junto con su adjunto. La notificación que ya les llegó al celular no se puede retirar.`
            : ""
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmarEliminar}
        onCancel={() => setPorEliminar(null)}
        variant="danger"
        loading={c.operandoId !== null}
      />
    </AdminPageShell>
  );
}
