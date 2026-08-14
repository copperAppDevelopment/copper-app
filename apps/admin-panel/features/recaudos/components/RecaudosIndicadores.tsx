import * as React from "react";
import { Card } from "@/components/ui/card";
import { formatoMoneda } from "@/lib/formato";

export interface RecaudosIndicadoresProps {
  totalRecaudado: number;
  totalAbonado: number;
  sinAbonar: number;
  sinAplicar: number;
  cantidad: number;
}

export function RecaudosIndicadores({
  totalRecaudado, totalAbonado, sinAbonar, sinAplicar, cantidad,
}: RecaudosIndicadoresProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Total recaudado
        </p>
        <p className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-2">
          {formatoMoneda(totalRecaudado)}
        </p>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">
          {cantidad} recaudos registrados
        </p>
      </Card>

      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Abonado a cargos
        </p>
        <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
          {formatoMoneda(totalAbonado)}
        </p>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">
          {formatoMoneda(sinAbonar)} sin abonar
        </p>
      </Card>

      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Sin aplicar
        </p>
        <p className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-2">{sinAplicar}</p>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">
          Requieren acción del administrador
        </p>
      </Card>
    </section>
  );
}
