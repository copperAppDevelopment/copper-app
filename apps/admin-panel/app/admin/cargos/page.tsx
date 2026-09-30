'use client';

import { useState } from "react";
import { Plus } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";
import { AdminPageShell } from "@/components/layout/admin-page-shell";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatoMoneda } from "@/lib/formato";
import { useCargos } from "@/features/cargos/hooks/useCargos";
import { CargosIndicadores } from "@/features/cargos/components/CargosIndicadores";
import { CargosTabla } from "@/features/cargos/components/CargosTabla";
import { CondonarCargoModal } from "@/features/cargos/components/CondonarCargoModal";
import { etiquetaApartamento } from "@/features/cargos/types";
import type { Cargo } from "@/features/cargos/types";
import { GenerarCobroModal } from "@/features/cobros/components/GenerarCobroModal";

export default function CargosPage() {
  const sesion = useAdminSession();
  const c = useCargos(sesion.conjuntoId, sesion.loading);

  const [cobroAbierto, setCobroAbierto] = useState(false);
  const [porCondonar, setPorCondonar] = useState<Cargo | null>(null);
  const [porReactivar, setPorReactivar] = useState<Cargo | null>(null);

  // El modal de cobros crea y deshace cargos por su cuenta: al cerrarlo, la tabla de aquí
  // puede haber quedado vieja.
  const cerrarCobro = () => {
    setCobroAbierto(false);
    c.recargar();
  };

  const confirmarReactivar = async () => {
    if (porReactivar) await c.reactivar(porReactivar.id);
    setPorReactivar(null);
  };

  return (
    <AdminPageShell
      sesion={sesion}
      active="cargos"
      loading={c.loading}
      titulo="Cargos"
      subtitulo={sesion.conjuntoNombre}
      acciones={
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setCobroAbierto(true)}>
          Nuevo cobro
        </Button>
      }
    >
      {c.error && <Alert variant="danger">{c.error}</Alert>}

      <CargosIndicadores {...c.indicadores} etiquetaPeriodo={c.etiquetaPeriodo} />

      <CargosTabla
        tabla={c.tabla}
        periodo={c.periodo}
        onPeriodoChange={c.cambiarPeriodo}
        opcionesPeriodo={c.opcionesPeriodo}
        etiquetaPeriodo={c.etiquetaPeriodo}
        soloCondonados={c.soloCondonados}
        filtro={c.filtro}
        onFiltroChange={c.cambiarFiltro}
        filtroEstado={c.filtroEstado}
        onEstadoChange={c.cambiarEstado}
        filtroConcepto={c.filtroConcepto}
        onConceptoChange={c.cambiarConcepto}
        opcionesConcepto={c.opcionesConcepto}
        onCondonar={setPorCondonar}
        onReactivar={setPorReactivar}
        operandoId={c.operandoId}
      />

      <CondonarCargoModal
        cargo={porCondonar}
        onClose={() => setPorCondonar(null)}
        onCondonar={c.condonar}
      />

      <GenerarCobroModal
        isOpen={cobroAbierto}
        onClose={cerrarCobro}
        conjuntoId={sesion.conjuntoId}
        conjuntoNombre={sesion.conjuntoNombre}
      />

      <ConfirmDialog
        isOpen={Boolean(porReactivar)}
        title="¿Reactivar el cargo?"
        description={
          porReactivar
            ? `${etiquetaApartamento(porReactivar)} volverá a deber ${formatoMoneda(porReactivar.valor_condonado)} de «${porReactivar.concepto_nombre}» (${porReactivar.periodo}). Se borra el motivo de la condonación, y si el cargo ya está vencido contará para la mora del próximo mes.`
            : ""
        }
        confirmText="Reactivar"
        cancelText="Cancelar"
        onConfirm={confirmarReactivar}
        onCancel={() => setPorReactivar(null)}
        variant="danger"
        loading={c.operandoId !== null}
      />
    </AdminPageShell>
  );
}
