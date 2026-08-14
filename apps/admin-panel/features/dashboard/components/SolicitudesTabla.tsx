'use client';

import * as React from "react";
import { MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommonTable } from "@/components/ui/table";
import { formatoFechaCorta } from "@/lib/formato";
import type { TablaLocal } from "@/hooks/useTablaLocal";
import type { Solicitud } from "../types";

const prioridades: Record<string, "danger" | "warning" | "success"> = {
  Alta: "danger",
  Media: "warning",
  Baja: "success",
};

const estados: Record<string, "warning" | "info" | "success"> = {
  Pendiente: "warning",
  "En Proceso": "info",
  Resuelto: "success",
};

export function SolicitudesTabla({ tabla }: { tabla: TablaLocal<Solicitud> }) {
  const columnas = [
    { key: "numero_apartamento", label: "Apto", sortable: true },
    { key: "nombre_residente", label: "Residente", sortable: true },
    {
      key: "titulo",
      label: "Asunto / Título",
      sortable: true,
      render: (s: Solicitud) => (
        <span className="font-semibold block max-w-[180px] truncate" title={s.titulo ?? ""}>
          {s.titulo || "Sin título"}
        </span>
      ),
    },
    {
      key: "prioridad",
      label: "Prioridad",
      sortable: true,
      render: (s: Solicitud) => (
        <Badge variant={prioridades[s.prioridad ?? ""] ?? "neutral"}>
          {s.prioridad || "Media"}
        </Badge>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      sortable: true,
      render: (s: Solicitud) => (
        <Badge variant={estados[s.estado ?? ""] ?? "neutral"}>{s.estado || "Pendiente"}</Badge>
      ),
    },
    {
      key: "fecha",
      label: "Fecha",
      sortable: true,
      render: (s: Solicitud) => (
        <span className="whitespace-nowrap">{formatoFechaCorta(s.fecha)}</span>
      ),
    },
    { key: "nombre_admin_asignado", label: "Asignado", sortable: true },
  ];

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand" />
          <span>Solicitudes Recientes (PQRs)</span>
        </div>
      }
      headerActions={
        <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs px-2.5 py-1 rounded-full font-semibold">
          {tabla.totalRows} en total
        </span>
      }
      noPadding
      className="shadow-sm"
    >
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
        emptyMessage="No hay solicitudes registradas para esta copropiedad."
      />
    </Card>
  );
}
