'use client';

import * as React from "react";
import { Building2, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { formatoMoneda, formatoFecha } from "@/lib/formato";
import { etiquetaSuscripcion, varianteSuscripcion, textoVigencia } from "@/lib/suscripciones";
import { useMisConjuntos } from "../hooks/useMisConjuntos";
import type { ConjuntoAdmin } from "../conjuntosTypes";

function Dato({ etiqueta, valor }: { etiqueta: string; valor: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        {etiqueta}
      </p>
      <p className="text-sm text-zinc-800 dark:text-zinc-100">{valor || "—"}</p>
    </div>
  );
}

function ConjuntoCard({ conjunto }: { conjunto: ConjuntoAdmin }) {
  const estado = conjunto.estado_suscripcion;
  const sinSuscripcion = !estado;

  return (
    <Card className="shadow-sm">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Building2 className="w-5 h-5 text-brand shrink-0" />
            <p className="font-bold text-zinc-900 dark:text-white truncate">
              {conjunto.nombre_conjunto}
            </p>
          </div>
          <Badge variant={varianteSuscripcion(estado)}>{etiquetaSuscripcion(estado)}</Badge>
        </div>

        {sinSuscripcion ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Este conjunto no tiene ninguna suscripción registrada.
          </p>
        ) : (
          <>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {textoVigencia(estado, conjunto.fecha_fin_suscripcion)}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <Dato etiqueta="Plan" valor={conjunto.nombre_plan} />
              <Dato etiqueta="Periodo" valor={conjunto.periodo_plan} />
              <Dato etiqueta="Inicio" valor={formatoFecha(conjunto.fecha_inicio_suscripcion)} />
              <Dato etiqueta="Vencimiento" valor={formatoFecha(conjunto.fecha_fin_suscripcion)} />
              <Dato
                etiqueta="Precio pagado"
                valor={conjunto.precio_suscripcion ? formatoMoneda(conjunto.precio_suscripcion) : null}
              />
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

export function TabMisConjuntos() {
  const c = useMisConjuntos();

  if (c.loading) {
    return <Card className="shadow-sm"><p className="text-sm text-zinc-500">Cargando…</p></Card>;
  }

  const caducados = c.conjuntos.filter(
    x => x.estado_suscripcion === "vencida" || x.estado_suscripcion === "bloqueada"
  ).length;

  return (
    <div className="space-y-6">
      {c.error && <Alert variant="danger">{c.error}</Alert>}

      {caducados > 0 && (
        <Alert variant="warning" title="Suscripciones sin renovar">
          <span className="flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
            {caducados === 1
              ? "Uno de tus conjuntos tiene la suscripción vencida."
              : `${caducados} de tus conjuntos tienen la suscripción vencida.`}
          </span>
        </Alert>
      )}

      {c.conjuntos.length === 0 ? (
        <Card className="shadow-sm">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-8">
            Todavía no administras ningún conjunto.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {c.conjuntos.map(conjunto => (
            <ConjuntoCard key={conjunto.conjunto_id} conjunto={conjunto} />
          ))}
        </div>
      )}
    </div>
  );
}
