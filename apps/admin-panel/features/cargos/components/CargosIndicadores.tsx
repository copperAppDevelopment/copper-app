import * as React from "react";
import { Card } from "@/components/ui/card";
import { formatoMoneda } from "@/lib/formato";

export interface CargosIndicadoresProps {
  facturado: number;
  recaudado: number;
  condonado: number;
  pendiente: number;
  cantidad: number;
  condonados: number;
  /** De qué hablan estas cifras: «Septiembre de 2026 (actual)», «Condonados, de cualquier…». */
  etiquetaPeriodo: string;
}

/**
 * Las cifras son de todo lo consultado y **no** responden a la búsqueda ni a los filtros de
 * estado y concepto: los totales se quedan quietos mientras se busca dentro de ellos.
 *
 * Facturado = recaudado + condonado + pendiente, salvo por los descuentos de pronto pago y los
 * saldos a favor, que no tienen tarjeta propia.
 */
export function CargosIndicadores({
  facturado, recaudado, condonado, pendiente, cantidad, condonados, etiquetaPeriodo,
}: CargosIndicadoresProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Facturado
        </p>
        <p className="text-[11px] text-brand font-semibold mt-0.5">{etiquetaPeriodo}</p>
        <p className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-2">
          {formatoMoneda(facturado)}
        </p>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">
          {cantidad === 1 ? "1 cargo" : `${cantidad} cargos`}
        </p>
      </Card>

      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Recaudado
        </p>
        <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
          {formatoMoneda(recaudado)}
        </p>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">
          Pagos ya abonados a estos cargos
        </p>
      </Card>

      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Condonado
        </p>
        <p className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-2">
          {formatoMoneda(condonado)}
        </p>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">
          {condonados === 0
            ? "Ningún cargo condonado"
            : condonados === 1 ? "1 cargo que ya no se cobra" : `${condonados} cargos que ya no se cobran`}
        </p>
      </Card>

      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
          Pendiente
        </p>
        <p className="text-2xl font-extrabold text-red-600 dark:text-red-400 mt-2">
          {formatoMoneda(pendiente)}
        </p>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">
          Lo que estos cargos todavía deben
        </p>
      </Card>
    </section>
  );
}
