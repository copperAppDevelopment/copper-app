'use client';

import * as React from "react";
import { Check, X } from "lucide-react";
import { CommonTable } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatoFecha } from "@/lib/formato";
import {
  ETIQUETA_ESTADO_VISITA, VARIANTE_ESTADO_VISITA, textoAutorizacion,
} from "@/lib/recepcion";
import type { EstadoVisita } from "@/lib/recepcion";
import type { EstadoRecepcion } from "../hooks/useRecepcion";
import type { VisitaRecepcion } from "../types";

export function VisitasTabla({ r }: { r: EstadoRecepcion }) {
  const columnas = [
    {
      key: "nombres",
      label: "Visitante",
      sortable: true,
      render: (v: VisitaRecepcion) => (
        <div className="min-w-0">
          <p className="font-semibold text-zinc-900 dark:text-white truncate">{v.nombres}</p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
            {[v.motivo, v.telefono].filter(Boolean).join(" · ") || "Sin motivo"}
          </p>
        </div>
      ),
    },
    {
      key: "label_apartamento",
      label: "Apartamento",
      sortable: true,
      render: (v: VisitaRecepcion) => v.label_apartamento ?? "—",
    },
    {
      key: "fecha",
      label: "Registrada",
      sortable: true,
      render: (v: VisitaRecepcion) => (
        <div className="min-w-0">
          <p>{formatoFecha(v.fecha)}</p>
          {v.registrado_por_nombre && (
            <p className="text-[11px] text-zinc-400">por {v.registrado_por_nombre}</p>
          )}
        </div>
      ),
    },
    {
      key: "estado_autorizacion",
      label: "Estado",
      sortable: true,
      render: (v: VisitaRecepcion) => {
        const estado = v.estado_autorizacion as EstadoVisita;
        const quien = textoAutorizacion(v.autorizado_por_nombre, v.autorizado_por_rol);

        return (
          <div className="min-w-0 space-y-0.5">
            <Badge variant={VARIANTE_ESTADO_VISITA[estado] ?? "neutral"}>
              {ETIQUETA_ESTADO_VISITA[estado] ?? estado}
            </Badge>
            {quien && (
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">por {quien}</p>
            )}
          </div>
        );
      },
    },
    {
      key: "acciones",
      label: "",
      render: (v: VisitaRecepcion) =>
        v.estado_autorizacion === "pendiente" ? (
          <div className="flex items-center gap-1 justify-end">
            <Button
              variant="ghost"
              size="sm"
              disabled={r.enviando}
              onClick={() => r.responderVisita(v.id, "rechazado").catch(() => {})}
              icon={<X className="w-3.5 h-3.5" />}
            >
              Rechazar
            </Button>
            <Button
              size="sm"
              disabled={r.enviando}
              onClick={() => r.responderVisita(v.id, "aprobado").catch(() => {})}
              icon={<Check className="w-3.5 h-3.5" />}
            >
              Aprobar
            </Button>
          </div>
        ) : null,
    },
  ];

  return (
    <CommonTable
      columns={columnas}
      data={r.tablaVisitas.datos}
      sortBy={r.tablaVisitas.sortBy}
      sortOrder={r.tablaVisitas.sortOrder}
      onSort={r.tablaVisitas.handleSort}
      currentPage={r.tablaVisitas.currentPage}
      pageSize={r.tablaVisitas.pageSize}
      totalRows={r.tablaVisitas.totalRows}
      onPageChange={r.tablaVisitas.setCurrentPage}
      emptyMessage="No hay visitas en este periodo."
    />
  );
}
