'use client';

import * as React from "react";
import { Card } from "@/components/ui/card";
import { ESTADOS, ETIQUETA_ESTADO } from "@/lib/solicitudes";
import type { FiltroEstado } from "../types";

export interface SolicitudesIndicadoresProps {
  indicadores: Record<string, number>;
  filtroEstado: FiltroEstado;
  onEstadoChange: (valor: FiltroEstado) => void;
}

/** El color del número acompaña al del `Badge` del mismo estado en la tabla. */
const colores: Record<string, string> = {
  pendientes: "text-amber-600 dark:text-amber-400",
  asignadas: "text-blue-600 dark:text-blue-400",
  en_proceso: "text-brand",
  completadas: "text-emerald-600 dark:text-emerald-400",
  canceladas: "text-zinc-500 dark:text-zinc-400",
};

export function SolicitudesIndicadores({
  indicadores, filtroEstado, onEstadoChange,
}: SolicitudesIndicadoresProps) {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {ESTADOS.map((estado) => {
        const activo = filtroEstado === estado;
        return (
          <Card
            key={estado}
            // Cada tarjeta filtra la tabla; volver a pulsarla quita el filtro.
            onClick={() => onEstadoChange(activo ? "todos" : estado)}
            role="button"
            tabIndex={0}
            aria-pressed={activo}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onEstadoChange(activo ? "todos" : estado);
              }
            }}
            className={`shadow-sm cursor-pointer transition-all hover:border-brand/40 ${
              activo ? "border-brand ring-2 ring-brand/20" : ""
            }`}
          >
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
              {ETIQUETA_ESTADO[estado]}
            </p>
            <p className={`text-2xl font-extrabold mt-2 ${colores[estado]}`}>
              {indicadores[estado] ?? 0}
            </p>
          </Card>
        );
      })}
    </section>
  );
}
