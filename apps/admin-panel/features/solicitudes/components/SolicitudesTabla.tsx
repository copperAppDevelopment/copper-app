'use client';

import * as React from "react";
import { FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CommonTable } from "@/components/ui/table";
import { formatoFecha, formatoMoneda } from "@/lib/formato";
import {
  ESTADOS, ETIQUETA_ESTADO, etiquetaEstado, varianteEstado,
  etiquetaPrioridad, variantePrioridad,
} from "@/lib/solicitudes";
import type { TablaLocal } from "@/hooks/useTablaLocal";
import type { Solicitud, FiltroEstado } from "../types";

export interface SolicitudesTablaProps {
  tabla: TablaLocal<Solicitud>;
  filtro: string;
  onFiltroChange: (valor: string) => void;
  filtroEstado: FiltroEstado;
  onEstadoChange: (valor: FiltroEstado) => void;
  onGestionar: (solicitud: Solicitud) => void;
}

export function SolicitudesTabla({
  tabla, filtro, onFiltroChange, filtroEstado, onEstadoChange, onGestionar,
}: SolicitudesTablaProps) {
  const columnas = [
    {
      key: "fecha_solicitud",
      label: "Radicada",
      sortable: true,
      render: (s: Solicitud) => (
        <span className="whitespace-nowrap">{formatoFecha(s.fecha_solicitud)}</span>
      ),
    },
    {
      key: "numero_apartamento",
      label: "Apto",
      sortable: true,
      render: (s: Solicitud) => s.numero_apartamento ?? "—",
    },
    {
      key: "nombre_residente",
      label: "Residente",
      sortable: true,
      render: (s: Solicitud) => s.nombre_residente || "Sin nombre",
    },
    {
      key: "titulo",
      label: "Asunto",
      sortable: true,
      render: (s: Solicitud) => (
        <div>
          <p className="font-semibold block max-w-[200px] truncate" title={s.titulo ?? ""}>
            {s.titulo || "Sin título"}
          </p>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{s.tipo_solicitud}</p>
        </div>
      ),
    },
    {
      key: "prioridad",
      label: "Prioridad",
      sortable: true,
      render: (s: Solicitud) => (
        <Badge variant={variantePrioridad(s.prioridad)}>{etiquetaPrioridad(s.prioridad)}</Badge>
      ),
    },
    {
      key: "estado_solicitud",
      label: "Estado",
      sortable: true,
      render: (s: Solicitud) => (
        <Badge variant={varianteEstado(s.estado_solicitud)}>
          {etiquetaEstado(s.estado_solicitud)}
        </Badge>
      ),
    },
    {
      key: "nombre_admin_asignado",
      label: "Asignado",
      sortable: true,
      render: (s: Solicitud) => (
        <span className={s.admin_conjunto_id ? "" : "text-zinc-400 dark:text-zinc-500"}>
          {s.nombre_admin_asignado || "Sin asignar"}
        </span>
      ),
    },
    {
      key: "costo",
      label: "Costo",
      sortable: true,
      render: (s: Solicitud) =>
        s.costo ? (
          <span className="whitespace-nowrap font-semibold">{formatoMoneda(s.costo)}</span>
        ) : (
          "—"
        ),
    },
    {
      key: "acciones",
      label: "",
      render: (s: Solicitud) => (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => onGestionar(s)}>
            Gestionar
          </Button>
        </div>
      ),
    },
  ];

  const hayFiltro = Boolean(filtro.trim()) || filtroEstado !== "todos";

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand" />
          <span>Listado de solicitudes</span>
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
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-xs">
          <Input
            id="filtro-solicitud"
            placeholder="Buscar por asunto, residente, apartamento o tipo…"
            value={filtro}
            onChange={(e) => onFiltroChange(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            id="filtro-estado-solicitud"
            value={filtroEstado}
            onChange={(e) => onEstadoChange(e.target.value as FiltroEstado)}
            options={[
              { value: "todos", label: "Todos los estados" },
              ...ESTADOS.map(e => ({ value: e, label: ETIQUETA_ESTADO[e] })),
            ]}
          />
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
            ? "Ninguna solicitud coincide con los filtros aplicados."
            : "Este conjunto todavía no tiene solicitudes radicadas."
        }
      />
    </Card>
  );
}
