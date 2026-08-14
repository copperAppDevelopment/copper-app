import * as React from "react";
import { History, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatoFecha } from "@/lib/formato";
import type { Carga, ResultadoCarga } from "../types";

export interface HistorialCargasProps {
  cargas: Carga[];
  onVerDetalle: (resultado: ResultadoCarga, cargaId: string) => void;
  onReintentar: (cargaId: string) => void;
  loading: boolean;
}

/** Es lo que hace que los conflictos sobrevivan al refresco de la página. */
export function HistorialCargas({
  cargas, onVerDetalle, onReintentar, loading,
}: HistorialCargasProps) {
  if (cargas.length === 0) return null;

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-brand" />
          <span>Cargas recientes</span>
        </div>
      }
      className="shadow-sm"
    >
      <div className="space-y-2">
        {cargas.map(c => (
          <div
            key={c.id}
            className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                {c.archivo_nombre || "archivo.csv"}
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {formatoFecha(c.creado_en)} · periodo {c.periodo} · {c.procesadas} filas ·{" "}
                <span className="text-emerald-600 dark:text-emerald-400">{c.insertados} cargadas</span>
                {c.errores > 0 && (
                  <> · <span className="text-amber-600 dark:text-amber-400">{c.errores} con problema</span></>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  onVerDetalle(
                    {
                      procesadas: c.procesadas,
                      insertados: c.insertados,
                      errores: c.errores,
                      detalles: Array.isArray(c.detalles) ? (c.detalles as any) : [],
                    },
                    c.id
                  )
                }
              >
                Ver detalle
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<RotateCw className="w-3.5 h-3.5" />}
                onClick={() => onReintentar(c.id)}
                loading={loading}
              >
                Reintentar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
