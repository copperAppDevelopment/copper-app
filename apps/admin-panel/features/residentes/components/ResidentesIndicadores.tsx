import * as React from "react";
import { Card } from "@/components/ui/card";

export interface ResidentesIndicadoresProps {
  total: number;
  activos: number;
  pendientes: number;
  conjuntoNombre: string;
}

export function ResidentesIndicadores({
  total, activos, pendientes, conjuntoNombre,
}: ResidentesIndicadoresProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Total residentes
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">{total}</span>
          <span className="text-zinc-500 text-xs font-bold">Registrados</span>
        </div>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">En {conjuntoNombre}</p>
      </Card>

      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Activos
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">{activos}</span>
          <span className="text-emerald-500 text-xs font-bold">Viviendo</span>
        </div>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">
          {total - activos} inactivos
        </p>
      </Card>

      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Pendientes de apartamento
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">{pendientes}</span>
          <span className="text-amber-500 text-xs font-bold">Sin asignar</span>
        </div>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">
          Requieren acción del administrador
        </p>
      </Card>
    </section>
  );
}
