'use client';

import * as React from "react";
import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { SpinnerPagina } from "@/components/ui/spinner";
import { formatoMoneda } from "@/lib/formato";
import { PERIODOS, ETIQUETA_PERIODO, COLUMNA_PRECIO } from "@/lib/conjuntos";
import { MAX_PLANES_ACTIVOS } from "@/lib/planesData";
import type { PlanCompleto } from "@/lib/planesData";
import { usePlanes } from "../hooks/usePlanes";
import { PlanesKpis } from "./PlanesKpis";
import { PlanFormModal } from "./PlanFormModal";

/**
 * Planes comerciales: los que la página de precios muestra.
 *
 * Lista y no `CommonTable` a propósito: son tres o cuatro filas y una tabla con orden y
 * paginación sobraría.
 */
export function PlanesPanel({ sesionCargando }: { sesionCargando: boolean }) {
  const p = usePlanes(sesionCargando);
  const [enEdicion, setEnEdicion] = useState<PlanCompleto | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const abrir = (plan: PlanCompleto | null) => {
    setEnEdicion(plan);
    setModalAbierto(true);
  };

  if (p.loading) return <SpinnerPagina />;

  return (
    <div className="space-y-6">
      {p.error && <Alert variant="danger" onClose={() => p.setError("")}>{p.error}</Alert>}
      {p.aviso && <Alert variant="success" onClose={() => p.setAviso("")}>{p.aviso}</Alert>}

      <PlanesKpis {...p.contadores} />

      <Card
        title="Planes"
        subtitle={`La página de precios muestra los activos, hasta ${MAX_PLANES_ACTIVOS}`}
        headerActions={
          <Button size="sm" onClick={() => abrir(null)} icon={<Plus className="w-4 h-4" />}>
            Nuevo plan
          </Button>
        }
        className="shadow-sm"
        noPadding
      >
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
          {p.planes.map(plan => (
            <div
              key={plan.id}
              className="p-5 flex flex-col lg:flex-row lg:items-center gap-4 justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-zinc-900 dark:text-white">{plan.nombre}</p>
                  <Badge variant="neutral">{plan.subtipo}</Badge>
                  <Badge variant={plan.activo ? "success" : "neutral"}>
                    {plan.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {plan.descripcion || "Sin descripción"}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  Hasta {plan.max_residentes} residentes
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                {PERIODOS.map(periodo => (
                  <div key={periodo} className="text-left">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-bold">
                      {ETIQUETA_PERIODO[periodo]}
                    </p>
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                      {formatoMoneda(Number(plan[COLUMNA_PRECIO[periodo] as keyof PlanCompleto]))}
                    </p>
                  </div>
                ))}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => abrir(plan)}>
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => p.alternarActivo(plan)}
                    // Con el cupo lleno no se puede encender un cuarto; apagar siempre se puede.
                    disabled={!plan.activo && p.cupoLleno}
                    title={
                      !plan.activo && p.cupoLleno
                        ? `Ya hay ${MAX_PLANES_ACTIVOS} planes activos: desactiva otro primero`
                        : undefined
                    }
                  >
                    {plan.activo ? "Desactivar" : "Activar"}
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {p.planes.length === 0 && (
            <p className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Todavía no hay planes.
            </p>
          )}
        </div>
      </Card>

      <PlanFormModal
        isOpen={modalAbierto}
        plan={enEdicion}
        cupoLleno={p.cupoLleno}
        onClose={() => setModalAbierto(false)}
        onGuardar={p.guardar}
      />
    </div>
  );
}
