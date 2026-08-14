'use client';

import { useState } from "react";
import { Plus, Upload, Info } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";
import { AdminPageShell } from "@/components/layout/admin-page-shell";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { useRecaudos } from "@/features/recaudos/hooks/useRecaudos";
import { RecaudosIndicadores } from "@/features/recaudos/components/RecaudosIndicadores";
import { RecaudosTabla } from "@/features/recaudos/components/RecaudosTabla";
import { CrearRecaudoModal } from "@/features/recaudos/components/CrearRecaudoModal";
import { CargaMasivaModal } from "@/features/recaudos/components/CargaMasivaModal";
import { HistorialCargas } from "@/features/recaudos/components/HistorialCargas";
import type { ResultadoCarga } from "@/features/recaudos/types";

export default function RecaudosPage() {
  const sesion = useAdminSession();
  const r = useRecaudos(sesion.conjuntoId, sesion.loading);

  const [crearAbierto, setCrearAbierto] = useState(false);
  const [cargaAbierta, setCargaAbierta] = useState(false);
  const [resultado, setResultado] = useState<ResultadoCarga | null>(null);
  const [cargaId, setCargaId] = useState<string | null>(null);
  const [cargaError, setCargaError] = useState("");
  const [cargaLoading, setCargaLoading] = useState(false);

  const abrirCarga = () => {
    setResultado(null); setCargaId(null); setCargaError("");
    setCargaAbierta(true);
  };

  const cargar = async (archivo: File, periodo: string) => {
    setCargaLoading(true); setCargaError(""); setResultado(null);
    try {
      const res = await r.cargar(archivo, periodo);
      setResultado(res.resultado);
      setCargaId(res.cargaId);
    } catch (err: any) {
      setCargaError(err.message);
    } finally {
      setCargaLoading(false);
    }
  };

  const reintentar = async (id: string) => {
    setCargaLoading(true); setCargaError("");
    setCargaAbierta(true);
    try {
      const res = await r.reintentar(id);
      setResultado(res.resultado);
      setCargaId(res.cargaId);
    } catch (err: any) {
      setCargaError(err.message);
    } finally {
      setCargaLoading(false);
    }
  };

  const { sinAplicar } = r.indicadores;

  return (
    <AdminPageShell
      sesion={sesion}
      active="recaudos"
      loading={r.loading}
      titulo="Recaudos"
      subtitulo={sesion.conjuntoNombre}
      acciones={
        <>
          <Button variant="outline" icon={<Upload className="w-4 h-4" />} onClick={abrirCarga}>
            Carga masiva
          </Button>
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setCrearAbierto(true)}>
            Cargar recaudo
          </Button>
        </>
      }
    >
      {r.error && <Alert variant="danger">{r.error}</Alert>}

      {sinAplicar > 0 && (
        <p className="flex items-start gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          <Info className="w-3.5 h-3.5 shrink-0 mt-px" />
          {sinAplicar === 1
            ? "Hay 1 recaudo sin aplicar: está registrado pero no se ha abonado a ningún cargo."
            : `Hay ${sinAplicar} recaudos sin aplicar: están registrados pero no se han abonado a ningún cargo.`}
        </p>
      )}

      <RecaudosIndicadores {...r.indicadores} />

      <RecaudosTabla
        tabla={r.tabla}
        filtro={r.filtro}
        onFiltroChange={r.cambiarFiltro}
        filtroEstado={r.filtroEstado}
        onEstadoChange={r.cambiarEstado}
        onAplicar={r.aplicar}
        aplicandoId={r.aplicandoId}
      />

      <HistorialCargas
        cargas={r.cargas}
        onVerDetalle={(res, id) => {
          setResultado(res); setCargaId(id); setCargaError(""); setCargaAbierta(true);
        }}
        onReintentar={reintentar}
        loading={cargaLoading}
      />

      <CrearRecaudoModal
        isOpen={crearAbierto}
        onClose={() => setCrearAbierto(false)}
        conjuntoNombre={sesion.conjuntoNombre}
        opcionesApartamento={r.opcionesApartamento}
        onCrear={r.crear}
      />

      <CargaMasivaModal
        isOpen={cargaAbierta}
        onClose={() => setCargaAbierta(false)}
        resultado={resultado}
        cargaId={cargaId}
        onCargar={cargar}
        onReintentar={reintentar}
        onAplicar={r.aplicar}
        aplicandoId={r.aplicandoId}
        error={cargaError}
        loading={cargaLoading}
      />
    </AdminPageShell>
  );
}
