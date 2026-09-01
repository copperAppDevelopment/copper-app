import * as React from "react";
import { Card } from "@/components/ui/card";
import { formatoMoneda } from "@/lib/formato";

export interface RecaudosIndicadoresProps {
  totalRecaudado: number;
  totalAbonado: number;
  sinAbonar: number;
  sinAplicar: number;
  cantidad: number;
  /** De qué periodo hablan estas cifras: «junio de 2026», «todos los periodos»… */
  etiquetaPeriodo: string;
  hayPeriodo: boolean;
}

/**
 * Las cifras son del periodo seleccionado, no del histórico, y **no** responden a la búsqueda
 * ni al filtro de estado: los totales del mes se mantienen quietos mientras se busca dentro
 * de él. Por eso el contador de aquí y el de la tabla pueden discrepar, y por eso cada uno
 * dice de qué está hablando.
 */
export function RecaudosIndicadores({
  totalRecaudado, totalAbonado, sinAbonar, sinAplicar, cantidad, etiquetaPeriodo, hayPeriodo,
}: RecaudosIndicadoresProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Total recaudado
        </p>
        <p className="text-[11px] text-brand font-semibold mt-0.5 capitalize">
          {etiquetaPeriodo}
        </p>
        <p className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-2">
          {formatoMoneda(totalRecaudado)}
        </p>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">
          {cantidad === 1 ? "1 recaudo" : `${cantidad} recaudos`}
          {hayPeriodo ? ` en ${etiquetaPeriodo}` : " registrados"}
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
