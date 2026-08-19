'use client';

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatoMoneda, formatoFecha } from "@/lib/formato";
import { PERIODOS, ETIQUETA_PERIODO, precioDelPlan } from "@/lib/conjuntos";
import type { TipoPeriodo } from "@/lib/conjuntos";
import { useAsignarPlan } from "../hooks/useAsignarPlan";
import type { FilaAsignacion } from "../types";

export interface AsignarPlanModalProps {
  isOpen: boolean;
  fila: FilaAsignacion | null;
  onClose: () => void;
  onAsignado: (mensaje: string) => void;
}

/**
 * Asigna un plan sin pasar por Wompi.
 *
 * Lleva paso de confirmación a propósito: esto habilita un conjunto sin cobrar nada y, si ya
 * tenía suscripción, reescribe su vigencia.
 */
export function AsignarPlanModal({ isOpen, fila, onClose, onAsignado }: AsignarPlanModalProps) {
  const a = useAsignarPlan(fila, isOpen);
  const enConfirmacion = a.paso === "confirmacion";

  const confirmar = async () => {
    const respuesta = await a.enviar();
    if (!respuesta) return;
    onAsignado(
      `${respuesta.actualizada ? "Se actualizó" : "Se creó"} la suscripción de ${respuesta.conjunto}: ${respuesta.plan}, vigente hasta el ${formatoFecha(respuesta.fechaFin)}.`
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={enConfirmacion ? "Confirmar la asignación" : "Asignar plan"}
      description={fila?.nombre_conjunto}
      onClose={onClose}
      size="lg"
      busy={a.enviando}
      footer={
        enConfirmacion ? (
          <>
            <Button variant="secondary" onClick={() => a.setPaso("form")} disabled={a.enviando}>
              Volver
            </Button>
            <Button onClick={confirmar} loading={a.enviando}>
              Confirmar asignación
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button onClick={a.continuar} disabled={a.cargando || Boolean(a.motivoInvalido())}>
              Continuar
            </Button>
          </>
        )
      }
    >
      {a.error && <Alert variant="danger">{a.error}</Alert>}

      {a.cargando ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Cargando planes…</p>
      ) : enConfirmacion ? (
        <div className="space-y-4">
          <dl className="text-sm space-y-2">
            <Linea etiqueta="Plan" valor={`${a.planElegido?.nombre ?? "—"} · ${ETIQUETA_PERIODO[a.periodo]}`} />
            <Linea etiqueta="A nombre de" valor={a.opcionesAdmin.find(o => o.value === a.adminUserId)?.label ?? "—"} />
            <Linea etiqueta="Precio registrado" valor={formatoMoneda(a.precioNumerico)} />
            <Linea
              etiqueta="Vigencia"
              valor={a.desde === "hoy" ? "Empieza hoy" : `Encadena al ${formatoFecha(fila?.fecha_fin)}`}
            />
          </dl>

          {a.avisos.map(aviso => (
            <Alert key={aviso} variant="warning">{aviso}</Alert>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {!a.admins.length && (
            <Alert variant="danger">{a.motivoInvalido()}</Alert>
          )}

          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Periodo
            </p>
            <div className="flex gap-2">
              {PERIODOS.map(p => (
                <Button
                  key={p}
                  variant={a.periodo === p ? "primary" : "outline"}
                  size="sm"
                  onClick={() => a.setPeriodo(p as TipoPeriodo)}
                >
                  {ETIQUETA_PERIODO[p]}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Plan
            </p>
            {a.planes.map(plan => {
              const elegido = plan.id === a.planId;
              return (
                <button
                  key={plan.id}
                  onClick={() => a.setPlanId(plan.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-colors cursor-pointer ${
                    elegido
                      ? "border-brand bg-brand/5"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-brand/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                        {plan.nombre}
                        {plan.id === fila?.plan_id && <Badge variant="info">Plan actual</Badge>}
                      </p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        Hasta {plan.max_residentes} residentes
                      </p>
                    </div>
                    <span className="text-xs font-bold text-brand shrink-0">
                      {formatoMoneda(precioDelPlan(plan, a.periodo))}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <Select
            label="Administrador de la suscripción"
            value={a.adminUserId}
            onChange={e => a.setAdminUserId(e.target.value)}
            options={a.opcionesAdmin}
            disabled={!a.admins.length}
            helperText="Queda a su nombre y se le habilita la cuenta."
          />

          <div className="space-y-1.5">
            <Input
              label="Precio a registrar"
              type="number"
              min="0"
              value={a.precio}
              onChange={e => a.setPrecio(e.target.value)}
              helperText="Cero para una cortesía. Escribe el valor solo si el conjunto pagó por fuera."
            />
            {a.planElegido && (
              <Button variant="outline" size="sm" onClick={() => a.setPrecio(String(a.precioLista))}>
                Usar precio de lista ({formatoMoneda(a.precioLista)})
              </Button>
            )}
          </div>

          {a.tieneVigencia && (
            <Select
              label="Desde cuándo cuenta"
              value={a.desde}
              onChange={e => a.setDesde(e.target.value as "hoy" | "vencimiento")}
              options={[
                { value: "hoy", label: "Empieza hoy" },
                { value: "vencimiento", label: `Encadena al vencimiento (${formatoFecha(fila?.fecha_fin)})` },
              ]}
            />
          )}
        </div>
      )}
    </Modal>
  );
}

function Linea({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-zinc-500 dark:text-zinc-400">{etiqueta}</dt>
      <dd className="font-semibold text-zinc-900 dark:text-white text-right">{valor}</dd>
    </div>
  );
}
