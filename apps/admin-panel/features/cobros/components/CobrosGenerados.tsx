'use client';

import * as React from "react";
import { useState } from "react";
import { Undo2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatoMoneda, formatoFecha } from "@/lib/formato";
import type { EstadoCrearCobro } from "../hooks/useCrearCobro";
import type { CobroGenerado } from "../types";

/** Cobros manuales ya creados, con la opción de deshacerlos. */
export function CobrosGenerados({ c }: { c: EstadoCrearCobro }) {
  const [porRevertir, setPorRevertir] = useState<CobroGenerado | null>(null);

  if (c.generados.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-8">
        Todavía no has generado ningún cobro extra en este conjunto.
      </p>
    );
  }

  const revertibles = porRevertir ? porRevertir.cargos - porRevertir.con_pagos : 0;

  return (
    <>
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {c.generados.map(cobro => (
          <div
            key={`${cobro.periodo}-${cobro.concepto_id}`}
            className="flex items-start justify-between gap-3 py-3 first:pt-0"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                  {cobro.concepto_codigo}
                </span>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                  {cobro.concepto_nombre}
                </p>
                <Badge variant="neutral">{cobro.periodo}</Badge>
                {cobro.con_pagos > 0 && (
                  <Badge variant="info">
                    <Lock className="w-2.5 h-2.5 mr-1" />
                    {cobro.con_pagos} con pagos
                  </Badge>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {cobro.cargos} {cobro.cargos === 1 ? "cargo" : "cargos"}
                {" · "}{formatoMoneda(cobro.total)}
                {cobro.vence_el ? ` · vence ${formatoFecha(cobro.vence_el)}` : ""}
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPorRevertir(cobro)}
              disabled={c.enviando || cobro.con_pagos === cobro.cargos}
              icon={<Undo2 className="w-3.5 h-3.5" />}
            >
              Deshacer
            </Button>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={Boolean(porRevertir)}
        title="¿Deshacer el cobro?"
        description={
          porRevertir
            ? `Se eliminarán ${revertibles} de los ${porRevertir.cargos} cargos de «${porRevertir.concepto_nombre}» del periodo ${porRevertir.periodo}.` +
              (porRevertir.con_pagos > 0
                ? ` Los ${porRevertir.con_pagos} que ya tienen pagos aplicados no se tocan: borrarlos haría desaparecer esos pagos del estado de cuenta.`
                : "")
            : ""
        }
        confirmText="Deshacer"
        cancelText="Cancelar"
        onConfirm={async () => {
          if (porRevertir) await c.revertir(porRevertir);
          setPorRevertir(null);
        }}
        onCancel={() => setPorRevertir(null)}
        variant="danger"
        loading={c.enviando}
      />
    </>
  );
}
