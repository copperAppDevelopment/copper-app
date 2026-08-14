import * as React from "react";
import { Card } from "@/components/ui/card";
import { formatoFecha } from "@/lib/formato";
import type { KpisAdmin } from "../types";

export function DashboardKpis({ kpis }: { kpis: KpisAdmin | null }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Unidades/Aptos
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
            {kpis?.total_apartamentos ?? "0"}
          </span>
          <span className="text-zinc-500 text-xs font-bold">Total</span>
        </div>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">
          {kpis?.apartamentos_ocupados ?? "0"} ocupados (
          {kpis?.porcentaje_ocupacion != null ? `${kpis.porcentaje_ocupacion}%` : "0%"})
        </p>
      </Card>

      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          PQRs Abiertas
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
            {kpis?.solicitudes_pendientes ?? "0"}
          </span>
          <span className="text-amber-500 text-xs font-semibold">Pendientes</span>
        </div>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">
          Solicitudes activas por revisar
        </p>
      </Card>

      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Residentes Activos
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
            {kpis?.total_residentes ?? "0"}
          </span>
          <span className="text-emerald-500 text-xs font-bold">Registrados</span>
        </div>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">
          Límite de plan: {kpis?.max_residentes_plan ?? "N/A"}
        </p>
      </Card>

      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Suscripción / Plan
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl font-extrabold text-brand truncate max-w-[180px]">
            {kpis?.nombre_plan ?? "Básico"}
          </span>
          <span className="text-zinc-500 text-[10px] font-bold uppercase">
            {kpis?.tipo_periodo ?? "Mensual"}
          </span>
        </div>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate mt-2">
          {kpis?.fecha_fin_suscripcion
            ? `Vence: ${formatoFecha(kpis.fecha_fin_suscripcion)}`
            : "Sin fecha de vencimiento"}
        </p>
      </Card>
    </section>
  );
}
