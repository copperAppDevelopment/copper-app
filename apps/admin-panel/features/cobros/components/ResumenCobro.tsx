'use client';

import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { formatoMoneda, formatoFecha } from "@/lib/formato";
import type { EstadoCrearCobro } from "../hooks/useCrearCobro";

function Linea({ etiqueta, valor }: { etiqueta: string; valor: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <span className="text-xs text-zinc-500 dark:text-zinc-400">{etiqueta}</span>
      <span className="text-sm text-zinc-800 dark:text-zinc-100 text-right">{valor}</span>
    </div>
  );
}

/** Segundo paso del cobro: qué se va a hacer exactamente y qué consecuencias tiene. */
export function ResumenCobro({ c }: { c: EstadoCrearCobro }) {
  const destinatario = c.esTodoElConjunto
    ? `Todo el conjunto · ${c.cuantosApartamentos} apartamentos`
    : c.opcionesApartamento.find(o => o.value === c.form.apartamento_id)?.label ?? "—";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 divide-y divide-zinc-100 dark:divide-zinc-800">
        <Linea
          etiqueta="Concepto"
          valor={c.conceptoElegido ? `${c.conceptoElegido.codigo} · ${c.conceptoElegido.nombre}` : "—"}
        />
        <Linea etiqueta="Dirigido a" valor={destinatario} />
        <Linea etiqueta="Periodo" valor={c.form.periodo} />
        <Linea etiqueta="Vence el" valor={formatoFecha(c.form.fecha_vencimiento)} />
        <Linea etiqueta="Valor por apartamento" valor={formatoMoneda(c.valorNumerico)} />

        <div className="flex items-baseline justify-between gap-3 pt-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Total
          </span>
          <span className="text-lg font-extrabold text-zinc-900 dark:text-white">
            {formatoMoneda(c.total)}
          </span>
        </div>
      </div>

      {c.cuantosApartamentos === 0 && (
        <Alert variant="danger" title="Sin apartamentos">
          Este conjunto no tiene ningún apartamento, así que no hay a quién cobrarle.
        </Alert>
      )}

      {c.avisos.map((aviso, i) => (
        <Alert key={i} variant="warning">
          <span className="flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
            {aviso}
          </span>
        </Alert>
      ))}

      <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
        Podrás deshacer este cobro desde la pestaña «Generados», pero solo mientras ningún
        residente lo haya pagado.
      </p>
    </div>
  );
}
