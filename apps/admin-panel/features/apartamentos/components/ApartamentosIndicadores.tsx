import * as React from "react";
import { Card } from "@/components/ui/card";

export interface ApartamentosIndicadoresProps {
  total: number;
  ocupados: number;
  vacios: number;
  porcentajeOcupacion: number;
  conjuntoNombre: string;
}

export function ApartamentosIndicadores({
  total,
  ocupados,
  vacios,
  porcentajeOcupacion,
  conjuntoNombre,
}: ApartamentosIndicadoresProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Total apartamentos
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">{total}</span>
          <span className="text-zinc-500 text-xs font-bold">Unidades</span>
        </div>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">
          Registradas en {conjuntoNombre}
        </p>
      </Card>

      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Ocupados
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">{ocupados}</span>
          <span className="text-emerald-500 text-xs font-bold">Con residentes</span>
        </div>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">
          {porcentajeOcupacion}% de ocupación
        </p>
      </Card>

      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Vacíos
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">{vacios}</span>
          <span className="text-amber-500 text-xs font-bold">Disponibles</span>
        </div>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">
          {100 - porcentajeOcupacion}% del total
        </p>
      </Card>
    </section>
  );
}
