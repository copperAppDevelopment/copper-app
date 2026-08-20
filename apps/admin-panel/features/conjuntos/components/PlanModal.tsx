'use client';

import * as React from "react";
import { useState, useEffect } from "react";
import { CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { formatoMoneda } from "@/lib/formato";
import { PERIODOS, ETIQUETA_PERIODO, precioDelPlan } from "@/lib/conjuntos";
import type { TipoPeriodo, Plan } from "@/lib/conjuntos";
import * as api from "../api";
import type { SuscripcionActual } from "../types";

export interface PlanModalProps {
  isOpen: boolean;
  conjuntoId: string;
  /** La suscripción vigente, para marcar el plan en curso. */
  suscripcion?: SuscripcionActual | null;
  /** Plan preseleccionado, para cuando se llega desde la página de precios con `?plan=`. */
  planInicial?: string;
  onClose: () => void;
}

/**
 * Elige plan y periodo y manda al checkout de Wompi.
 *
 * No confirma nada por su cuenta: quien activa la suscripción es el webhook cuando Wompi
 * aprueba la transacción. Aquí solo se abre el cobro y se redirige.
 */
export function PlanModal({
  isOpen, conjuntoId, suscripcion, planInicial, onClose,
}: PlanModalProps) {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [planId, setPlanId] = useState("");
  const [periodo, setPeriodo] = useState<TipoPeriodo>("mensual");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [pagando, setPagando] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let cancelado = false;

    setError("");
    setCargando(true);

    api.listarPlanes()
      .then(lista => {
        if (cancelado) return;
        setPlanes(lista);
        // El plan pedido solo vale si sigue activo: la lista ya viene filtrada.
        const pedido = lista.some(p => p.id === planInicial) ? planInicial : undefined;
        setPlanId(pedido ?? suscripcion?.plan_id ?? lista[0]?.id ?? "");
      })
      .catch(e => {
        console.error("Error al cargar los planes:", e);
        if (!cancelado) setError("No se pudieron cargar los planes.");
      })
      .finally(() => { if (!cancelado) setCargando(false); });

    return () => { cancelado = true; };
  }, [isOpen, suscripcion?.plan_id, planInicial]);

  const pagar = async () => {
    setPagando(true);
    setError("");
    try {
      const { checkout_url } = await api.crearPago(conjuntoId, planId, periodo);
      // Wompi devuelve al panel con `redirect-url`; la lista se recarga sola al volver.
      window.location.href = checkout_url;
    } catch (err: any) {
      setError(err.message);
      setPagando(false);
    }
  };

  const seleccionado = planes.find(p => p.id === planId);

  return (
    <Modal
      isOpen={isOpen}
      title={suscripcion ? "Cambiar o renovar el plan" : "Activar la suscripción"}
      onClose={onClose}
      busy={pagando}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={pagando}>Cancelar</Button>
          <Button
            onClick={pagar}
            loading={pagando}
            disabled={!planId || cargando}
            icon={<CreditCard className="w-4 h-4" />}
          >
            {seleccionado ? `Pagar ${formatoMoneda(precioDelPlan(seleccionado, periodo))}` : "Pagar"}
          </Button>
        </>
      }
    >
      {error && <Alert variant="danger">{error}</Alert>}

      {cargando ? (
        <p className="text-sm text-zinc-500">Cargando planes…</p>
      ) : (
        <>
          <div className="flex gap-2">
            {PERIODOS.map(p => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  periodo === p
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-850"
                }`}
              >
                {ETIQUETA_PERIODO[p]}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {planes.map(plan => {
              const activo = plan.id === planId;
              const enCurso = suscripcion?.plan_id === plan.id;

              return (
                <button
                  key={plan.id}
                  onClick={() => setPlanId(plan.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-colors cursor-pointer ${
                    activo
                      ? "border-brand bg-brand/5"
                      : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">
                          {plan.nombre}
                        </p>
                        <Badge variant="neutral">{plan.subtipo}</Badge>
                        {enCurso && <Badge variant="info">Plan actual</Badge>}
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Hasta {plan.max_residentes} residentes
                        {plan.descripcion ? ` · ${plan.descripcion}` : ""}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">
                        {formatoMoneda(precioDelPlan(plan, periodo))}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-400">
                        {ETIQUETA_PERIODO[periodo]}
                      </p>
                    </div>
                  </div>

                  {activo && (
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold text-brand mt-2">
                      <Check className="w-3 h-3" /> Seleccionado
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
            El pago se hace en Wompi. La suscripción se activa cuando la pasarela confirma
            la transacción, no al volver al panel.
          </p>
        </>
      )}
    </Modal>
  );
}
