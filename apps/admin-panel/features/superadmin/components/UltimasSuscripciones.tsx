import * as React from "react";
import { CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommonTable, type TableColumn } from "@/components/ui/table";
import { formatoMoneda, formatoFecha } from "@/lib/formato";
import { etiquetaSuscripcion, varianteSuscripcion } from "@/lib/suscripciones";
import { ULTIMAS_SUSCRIPCIONES } from "../api";
import type { SuscripcionReciente } from "../types";

const columnas: TableColumn<SuscripcionReciente>[] = [
  {
    key: "nombre_conjunto",
    label: "Conjunto",
    render: (s) => (
      <span className="font-semibold text-zinc-900 dark:text-white">
        {/* Hay nombres guardados con espacios al final: «Lusitania ». */}
        {s.nombre_conjunto?.trim() || "Sin nombre"}
      </span>
    ),
  },
  {
    key: "nombre_plan",
    label: "Plan",
    render: (s) => (
      <div>
        <p className="font-semibold">{s.nombre_plan ?? "—"}</p>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 capitalize">
          {s.tipo_periodo ?? "—"}
        </p>
      </div>
    ),
  },
  {
    key: "precio_pagado",
    label: "Valor",
    render: (s) => formatoMoneda(s.precio_pagado),
  },
  {
    key: "fecha_suscripcion",
    label: "Fecha",
    render: (s) => formatoFecha(s.fecha_suscripcion),
  },
  {
    key: "estado",
    label: "Estado",
    render: (s) => (
      <Badge variant={varianteSuscripcion(s.estado)}>{etiquetaSuscripcion(s.estado)}</Badge>
    ),
  },
];

export function UltimasSuscripciones({
  suscripciones,
}: {
  suscripciones: SuscripcionReciente[];
}) {
  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-brand" />
          <span>Últimas suscripciones</span>
        </div>
      }
      subtitle={`Las ${ULTIMAS_SUSCRIPCIONES} más recientes de toda la plataforma`}
      className="shadow-sm"
      noPadding
    >
      {/* Sin paginación ni ordenamiento: son cinco filas fijas ya ordenadas por la consulta.
          La carga la cubre el spinner del armazón, así que tampoco hace falta el esqueleto. */}
      <CommonTable
        columns={columnas}
        data={suscripciones}
        pageSize={ULTIMAS_SUSCRIPCIONES}
        emptyMessage="Todavía no hay suscripciones registradas"
      />
    </Card>
  );
}
