'use client';

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommonTable, type TableColumn } from "@/components/ui/table";
import { formatoMoneda, formatoFecha } from "@/lib/formato";
import { etiquetaSuscripcion, varianteSuscripcion, textoVigencia } from "@/lib/suscripciones";
import { ETIQUETA_PERIODO } from "@/lib/conjuntos";
import type { TipoPeriodo } from "@/lib/conjuntos";
import type { FilaAsignacion } from "../types";
import type { EstadoAsignacion } from "../hooks/useAsignacionPlanes";

export interface AsignacionTablaProps {
  a: EstadoAsignacion;
  onAsignar: (fila: FilaAsignacion) => void;
  onRevocar: (fila: FilaAsignacion) => void;
}

export function AsignacionTabla({ a, onAsignar, onRevocar }: AsignacionTablaProps) {
  const columnas: TableColumn<FilaAsignacion>[] = [
    {
      key: "nombre_conjunto",
      label: "Conjunto",
      sortable: true,
      render: (f) => (
        <div>
          <p className="font-semibold text-zinc-900 dark:text-white">{f.nombre_conjunto}</p>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
            {f.propietario_nombre ?? "Sin administrador propietario"}
          </p>
        </div>
      ),
    },
    {
      key: "nombre_plan",
      label: "Plan",
      sortable: true,
      render: (f) =>
        f.nombre_plan ? (
          <div>
            <p className="font-semibold">{f.nombre_plan}</p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              {ETIQUETA_PERIODO[f.tipo_periodo as TipoPeriodo] ?? f.tipo_periodo}
              {f.metodo_pago === "manual" && " · asignado a mano"}
            </p>
          </div>
        ) : (
          <span className="text-zinc-400 dark:text-zinc-500">Sin plan</span>
        ),
    },
    {
      key: "precio_pagado",
      label: "Valor",
      sortable: true,
      render: (f) => (f.suscripcion_id ? formatoMoneda(f.precio_pagado) : "—"),
    },
    {
      key: "fecha_fin",
      label: "Vigencia",
      sortable: true,
      render: (f) =>
        f.suscripcion_id ? (
          <div>
            <p>{formatoFecha(f.fecha_fin)}</p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              {textoVigencia(f.estado_suscripcion, f.fecha_fin)}
            </p>
          </div>
        ) : (
          "—"
        ),
    },
    {
      key: "estado_suscripcion",
      label: "Estado",
      sortable: true,
      render: (f) =>
        f.suscripcion_id ? (
          <Badge variant={varianteSuscripcion(f.estado_suscripcion)}>
            {etiquetaSuscripcion(f.estado_suscripcion)}
          </Badge>
        ) : (
          <Badge variant="neutral">Sin suscripción</Badge>
        ),
    },
    {
      key: "acciones",
      label: "",
      render: (f) => (
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={() => onAsignar(f)}>
            {f.suscripcion_id ? "Cambiar plan" : "Asignar plan"}
          </Button>
          {/* Solo tiene sentido cortar lo que todavía está vigente. */}
          {f.fecha_fin && new Date(f.fecha_fin) > new Date() && (
            <Button variant="ghost" size="sm" onClick={() => onRevocar(f)}>
              Revocar
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Card
      title="Conjuntos y su suscripción"
      subtitle="Un conjunto por fila, con la suscripción de vencimiento más lejano"
      className="shadow-sm"
      noPadding
    >
      <CommonTable
        columns={columnas}
        data={a.tabla.datos}
        sortBy={a.tabla.sortBy}
        sortOrder={a.tabla.sortOrder}
        onSort={a.tabla.handleSort}
        currentPage={a.tabla.currentPage}
        pageSize={a.tabla.pageSize}
        totalRows={a.tabla.totalRows}
        onPageChange={a.tabla.setCurrentPage}
        emptyMessage="No hay conjuntos que coincidan con la búsqueda"
      />
    </Card>
  );
}
