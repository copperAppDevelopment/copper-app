'use client';

import * as React from "react";
import { DollarSign, Search, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CommonTable } from "@/components/ui/table";
import { formatoMoneda, formatoFecha } from "@/lib/formato";
import type { TablaLocal } from "@/hooks/useTablaLocal";
import { totalAplicado, estadoDe, MESES } from "../utils";
import type { Recaudo, FiltroEstado, BasePeriodo } from "../types";

export interface RecaudosTablaProps {
  tabla: TablaLocal<Recaudo>;
  filtro: string;
  onFiltroChange: (valor: string) => void;
  filtroEstado: FiltroEstado;
  onEstadoChange: (valor: FiltroEstado) => void;
  anio: string;
  onAnioChange: (valor: string) => void;
  mes: string;
  onMesChange: (valor: string) => void;
  basePeriodo: BasePeriodo;
  onBasePeriodoChange: (valor: BasePeriodo) => void;
  opcionesAnio: { value: string; label: string }[];
  /** Deja el periodo en «todos»: la salida del filtro con que abre la página. */
  onLimpiarPeriodo: () => void;
  hayPeriodo: boolean;
  etiquetaPeriodo: string;
  onAplicar: (recaudoId: string) => void;
  aplicandoId: string | null;
}

export function RecaudosTabla({
  tabla, filtro, onFiltroChange, filtroEstado, onEstadoChange,
  anio, onAnioChange, mes, onMesChange, basePeriodo, onBasePeriodoChange,
  opcionesAnio, onLimpiarPeriodo, hayPeriodo, etiquetaPeriodo,
  onAplicar, aplicandoId,
}: RecaudosTablaProps) {
  const columnas = [
    {
      key: "fecha",
      label: "Fecha",
      sortable: true,
      render: (r: Recaudo) => (
        <div>
          <p className="whitespace-nowrap font-semibold text-zinc-900 dark:text-white">
            {formatoFecha(r.fecha)}
          </p>
          {r.fecha_aplicacion !== r.fecha && (
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
              aplicado {formatoFecha(r.fecha_aplicacion)}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "apartamentos",
      label: "Apartamento",
      render: (r: Recaudo) => r.apartamentos?.numero_apartamento ?? r.referencia_1 ?? "—",
    },
    {
      key: "valor_total",
      label: "Valor",
      sortable: true,
      render: (r: Recaudo) => (
        <span className="font-semibold whitespace-nowrap">{formatoMoneda(r.valor_total)}</span>
      ),
    },
    {
      key: "origen",
      label: "Origen",
      render: (r: Recaudo) =>
        [r.origen, r.tipo_recaudo_origen?.trim()].filter(Boolean).join(" · ") || "—",
    },
    { key: "periodo", label: "Periodo", sortable: true },
    {
      key: "estado",
      label: "Estado",
      render: (r: Recaudo) => {
        const estado = estadoDe(r);
        if (estado === "aplicados") return <Badge variant="success">Aplicado</Badge>;
        if (estado === "parciales") {
          return (
            <span className="flex flex-col gap-0.5">
              <Badge variant="warning">Parcial</Badge>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                {formatoMoneda(totalAplicado(r))}
              </span>
            </span>
          );
        }
        return <Badge variant="neutral">Sin aplicar</Badge>;
      },
    },
    {
      key: "acciones",
      label: "",
      render: (r: Recaudo) =>
        totalAplicado(r) === 0 ? (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAplicar(r.id)}
              loading={aplicandoId === r.id}
            >
              Aplicar
            </Button>
          </div>
        ) : null,
    },
  ];

  const hayFiltro = Boolean(filtro.trim()) || filtroEstado !== "todos" || hayPeriodo;

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-brand" />
          <span>Listado de recaudos</span>
        </div>
      }
      headerActions={
        <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs px-2.5 py-1 rounded-full font-semibold">
          {tabla.totalRows} {hayFiltro ? "coinciden" : "en total"}
        </span>
      }
      noPadding
      className="shadow-sm"
    >
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 space-y-3">
        {/* Sin etiquetas encima: el texto de la primera opción de cada selector ya dice de
            qué es, como en «Todos los estados». */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
          <div className="flex-1 min-w-56 max-w-xs">
            <Input
              id="filtro-recaudo"
              placeholder="Buscar por apartamento, referencia u origen…"
              value={filtro}
              onChange={(e) => onFiltroChange(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="w-full sm:w-36">
            <Select
              id="filtro-anio-recaudo"
              value={anio}
              onChange={(e) => onAnioChange(e.target.value)}
              options={[{ value: "", label: "Todos los años" }, ...opcionesAnio]}
            />
          </div>
          <div className="w-full sm:w-40">
            <Select
              id="filtro-mes-recaudo"
              value={mes}
              onChange={(e) => onMesChange(e.target.value)}
              options={[{ value: "", label: "Todos los meses" }, ...MESES]}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              id="filtro-base-recaudo"
              value={basePeriodo}
              onChange={(e) => onBasePeriodoChange(e.target.value as BasePeriodo)}
              options={[
                { value: "fecha", label: "Por fecha de pago" },
                { value: "periodo", label: "Por periodo contable" },
              ]}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              id="filtro-estado-recaudo"
              value={filtroEstado}
              onChange={(e) => onEstadoChange(e.target.value as FiltroEstado)}
              options={[
                { value: "todos", label: "Todos los estados" },
                { value: "aplicados", label: "Aplicados" },
                { value: "parciales", label: "Parciales" },
                { value: "sin_aplicar", label: "Sin aplicar" },
              ]}
            />
          </div>
        </div>

        {/* La página abre filtrada por el mes en curso: esto lo dice y ofrece deshacerlo,
            para no depender de que el usuario lea los selectores. */}
        {hayPeriodo && (
          <p className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
            <CalendarRange className="w-3.5 h-3.5 shrink-0" />
            Mostrando {etiquetaPeriodo}
            {basePeriodo === "fecha" ? ", por fecha de pago" : ", por periodo contable"}.
            <button
              type="button"
              onClick={onLimpiarPeriodo}
              className="text-brand hover:text-brand-hover font-semibold cursor-pointer"
            >
              Quitar filtro de periodo
            </button>
          </p>
        )}
      </div>

      <CommonTable
        columns={columnas}
        data={tabla.datos}
        sortBy={tabla.sortBy}
        sortOrder={tabla.sortOrder}
        onSort={tabla.handleSort}
        currentPage={tabla.currentPage}
        pageSize={tabla.pageSize}
        totalRows={tabla.totalRows}
        onPageChange={tabla.setCurrentPage}
        emptyMessage={
          hayPeriodo ? (
            <>
              No hay recaudos en {etiquetaPeriodo}.{" "}
              <button
                type="button"
                onClick={onLimpiarPeriodo}
                className="text-brand hover:text-brand-hover font-bold cursor-pointer"
              >
                Ver todos los periodos
              </button>
            </>
          ) : hayFiltro ? (
            "Ningún recaudo coincide con los filtros aplicados."
          ) : (
            "Este conjunto todavía no tiene recaudos registrados."
          )
        }
      />
    </Card>
  );
}
