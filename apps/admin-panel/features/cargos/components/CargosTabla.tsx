'use client';

import * as React from "react";
import { Receipt, Search, Ban, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CommonTable } from "@/components/ui/table";
import { formatoMoneda, formatoFecha } from "@/lib/formato";
import type { TablaLocal } from "@/hooks/useTablaLocal";
import { ETIQUETA_ESTADO, etiquetaApartamento, sePuedeCondonar } from "../types";
import type { Cargo, EstadoCargo, FiltroEstado } from "../types";

export interface CargosTablaProps {
  tabla: TablaLocal<Cargo>;
  periodo: string;
  onPeriodoChange: (valor: string) => void;
  opcionesPeriodo: { value: string; label: string }[];
  etiquetaPeriodo: string;
  /** Se está viendo «condonados de cualquier periodo»: el filtro de estado sobra. */
  soloCondonados: boolean;
  filtro: string;
  onFiltroChange: (valor: string) => void;
  filtroEstado: FiltroEstado;
  onEstadoChange: (valor: FiltroEstado) => void;
  filtroConcepto: string;
  onConceptoChange: (valor: string) => void;
  opcionesConcepto: { value: string; label: string }[];
  onCondonar: (cargo: Cargo) => void;
  onReactivar: (cargo: Cargo) => void;
  operandoId: string | null;
}

const VARIANTE_ESTADO: Record<EstadoCargo, "neutral" | "success" | "warning" | "info"> = {
  pendiente: "neutral",
  abonado: "warning",
  pagado: "success",
  condonado: "info",
};

const ETIQUETA_ORIGEN: Record<string, string> = {
  manual: "Cobro extra",
  import_excel: "Importado",
};

export function CargosTabla({
  tabla, periodo, onPeriodoChange, opcionesPeriodo, etiquetaPeriodo, soloCondonados,
  filtro, onFiltroChange, filtroEstado, onEstadoChange,
  filtroConcepto, onConceptoChange, opcionesConcepto,
  onCondonar, onReactivar, operandoId,
}: CargosTablaProps) {
  const columnas = [
    {
      key: "numero_apt",
      label: "Apartamento",
      sortable: true,
      render: (c: Cargo) => (
        <span className="font-semibold text-zinc-900 dark:text-white whitespace-nowrap">
          {etiquetaApartamento(c)}
        </span>
      ),
    },
    {
      key: "concepto_nombre",
      label: "Concepto",
      sortable: true,
      render: (c: Cargo) => (
        <div>
          <p>{c.concepto_nombre}</p>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
            {[c.periodo, ETIQUETA_ORIGEN[c.origen]].filter(Boolean).join(" · ")}
          </p>
        </div>
      ),
    },
    {
      key: "fecha_vencimiento",
      label: "Vence",
      sortable: true,
      render: (c: Cargo) => (
        <span className="whitespace-nowrap">{formatoFecha(c.fecha_vencimiento)}</span>
      ),
    },
    {
      key: "valor_final",
      label: "Valor",
      sortable: true,
      render: (c: Cargo) => (
        <span className="font-semibold whitespace-nowrap">{formatoMoneda(c.valor_final)}</span>
      ),
    },
    {
      key: "pagado",
      label: "Pagado",
      sortable: true,
      render: (c: Cargo) =>
        Number(c.pagado) > 0
          ? <span className="text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{formatoMoneda(c.pagado)}</span>
          : "—",
    },
    {
      key: "saldo",
      label: "Saldo",
      sortable: true,
      render: (c: Cargo) =>
        Number(c.saldo) > 0
          ? <span className="font-semibold text-red-600 dark:text-red-400 whitespace-nowrap">{formatoMoneda(c.saldo)}</span>
          : <span className="text-zinc-400">{formatoMoneda(0)}</span>,
    },
    {
      key: "estado",
      label: "Estado",
      render: (c: Cargo) => (
        <div className="max-w-56">
          <Badge variant={VARIANTE_ESTADO[c.estado]}>{ETIQUETA_ESTADO[c.estado]}</Badge>
          {c.estado === "condonado" && (
            <>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">
                {formatoMoneda(c.valor_condonado)}
                {c.condonado_en ? ` · ${formatoFecha(c.condonado_en)}` : ""}
                {c.condonado_por_nombre ? ` · ${c.condonado_por_nombre}` : ""}
              </p>
              {c.condonado_motivo && (
                <p
                  className="text-[10px] text-zinc-500 dark:text-zinc-400 italic line-clamp-2"
                  title={c.condonado_motivo}
                >
                  «{c.condonado_motivo}»
                </p>
              )}
            </>
          )}
        </div>
      ),
    },
    {
      key: "acciones",
      label: "",
      render: (c: Cargo) => (
        <div className="flex justify-end">
          {c.estado === "condonado" ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReactivar(c)}
              loading={operandoId === c.id}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reactivar
            </Button>
          ) : sePuedeCondonar(c) ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCondonar(c)}
              disabled={operandoId !== null}
              icon={<Ban className="w-3.5 h-3.5" />}
            >
              Condonar
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  const hayFiltro = Boolean(filtro.trim()) || filtroEstado !== "todos" || Boolean(filtroConcepto);

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-brand" />
          <span>Listado de cargos</span>
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
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
          <div className="flex-1 min-w-48 max-w-xs">
            <Input
              id="filtro-cargo"
              placeholder="Buscar por apartamento o torre…"
              value={filtro}
              onChange={(e) => onFiltroChange(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="w-full sm:w-64">
            <Select
              id="filtro-periodo-cargo"
              value={periodo}
              onChange={(e) => onPeriodoChange(e.target.value)}
              options={opcionesPeriodo}
            />
          </div>
          <div className="w-full sm:w-52">
            <Select
              id="filtro-concepto-cargo"
              value={filtroConcepto}
              onChange={(e) => onConceptoChange(e.target.value)}
              options={[{ value: "", label: "Todos los conceptos" }, ...opcionesConcepto]}
            />
          </div>
          {!soloCondonados && (
            <div className="w-full sm:w-44">
              <Select
                id="filtro-estado-cargo"
                value={filtroEstado}
                onChange={(e) => onEstadoChange(e.target.value as FiltroEstado)}
                options={[
                  { value: "todos", label: "Todos los estados" },
                  { value: "pendiente", label: "Pendientes" },
                  { value: "abonado", label: "Abonados" },
                  { value: "pagado", label: "Pagados" },
                  { value: "condonado", label: "Condonados" },
                ]}
              />
            </div>
          )}
        </div>
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
          hayFiltro
            ? "Ningún cargo coincide con los filtros aplicados."
            : soloCondonados
              ? "Este conjunto no tiene ningún cargo condonado."
              : `No hay cargos en ${etiquetaPeriodo}. Prueba con otro periodo.`
        }
      />
    </Card>
  );
}
