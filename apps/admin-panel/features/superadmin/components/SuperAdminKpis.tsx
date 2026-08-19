import * as React from "react";
import { Card } from "@/components/ui/card";
import { formatoMoneda } from "@/lib/formato";
import type { KpisSuperAdmin } from "../types";

const MES = new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric" });

export function SuperAdminKpis({ kpis }: { kpis: KpisSuperAdmin | null }) {
  const mes = MES.format(new Date());

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Copropiedades
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
            {kpis?.total_conjuntos ?? "0"}
          </span>
          <span className="text-emerald-500 text-xs font-bold">Activas</span>
        </div>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">
          Conjuntos con la cuenta habilitada
        </p>
      </Card>

      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Administradores
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
            {kpis?.total_admins ?? "0"}
          </span>
          <span className="text-zinc-500 text-xs font-bold">Total</span>
        </div>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">
          Usuarios con rol de administrador
        </p>
      </Card>

      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Ingresos por suscripción
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl font-extrabold text-brand">
            {formatoMoneda(kpis?.ingresos_suscripciones_mes)}
          </span>
        </div>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2 first-letter:uppercase">
          Facturado por Copper en {mes}
        </p>
      </Card>

      {/* Este KPI no es facturación de Copper: es lo que los residentes le pagan a su propio
          conjunto. La etiqueta lo dice porque la maqueta lo llamaba «Recaudo Global». */}
      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Recaudo de residentes
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">
            {formatoMoneda(kpis?.ingresos_mes_actual)}
          </span>
        </div>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2 first-letter:uppercase">
          Pagos aprobados a las copropiedades en {mes}
        </p>
      </Card>
    </section>
  );
}
