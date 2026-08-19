import * as React from "react";
import { Card } from "@/components/ui/card";
import { MAX_PLANES_ACTIVOS } from "@/lib/planesData";

export interface PlanesKpisProps {
  total: number;
  activos: number;
  inactivos: number;
}

export function PlanesKpis({ total, activos, inactivos }: PlanesKpisProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Planes totales
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">{total}</span>
        </div>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">
          Incluidos los que no se están vendiendo
        </p>
      </Card>

      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Activos
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">{activos}</span>
          <span className="text-zinc-500 text-xs font-bold">de {MAX_PLANES_ACTIVOS}</span>
        </div>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">
          Son los que aparecen en la página de precios
        </p>
      </Card>

      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Inactivos
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">{inactivos}</span>
        </div>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">
          No se pueden contratar ni renovar
        </p>
      </Card>
    </section>
  );
}
