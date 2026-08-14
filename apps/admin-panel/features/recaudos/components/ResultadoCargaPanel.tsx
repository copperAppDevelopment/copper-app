'use client';

import * as React from "react";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DetalleCarga, ResultadoCarga } from "../types";

/**
 * El parser de la edge function selecciona filas por regex de fecha, así que la fila de
 * parámetros de la cabecera del informe (con el rango de fechas consultado) también casa
 * y produce un error espurio de "apartamento no encontrado" en cada archivo.
 */
const esRuidoDeCabecera = (d: DetalleCarga) =>
  d.tipo === "apartamento" && /Cuenta Corriente|Tipo de Fecha|Fecha Inicial/i.test(d.linea);

const grupos: {
  tipo: DetalleCarga["tipo"];
  titulo: string;
  ayuda: string;
  variante: "info" | "warning" | "danger";
}[] = [
  {
    tipo: "duplicado",
    titulo: "Ya estaban cargados",
    ayuda: "No es un error: estas filas ya existían y se omitieron. Es lo que hace seguro reintentar.",
    variante: "info",
  },
  {
    tipo: "apartamento",
    titulo: "Apartamento no encontrado",
    ayuda: "La referencia del banco no coincide exactamente con ningún número de apartamento. «030» no encuentra «30».",
    variante: "warning",
  },
  {
    tipo: "aplicacion",
    titulo: "Cargados pero sin aplicar",
    ayuda: "El pago se registró pero no se abonó a ningún cargo. Reintentar el archivo no lo corrige: aplícalos desde la tabla.",
    variante: "danger",
  },
  {
    tipo: "validacion",
    titulo: "Filas incompletas",
    ayuda: "Les falta la fecha o la referencia del apartamento.",
    variante: "warning",
  },
  {
    tipo: "insercion",
    titulo: "Rechazadas por la base de datos",
    ayuda: "Error al guardar la fila.",
    variante: "danger",
  },
];

export function ResultadoCargaPanel({
  resultado,
  onAplicar,
  aplicandoId,
}: {
  resultado: ResultadoCarga;
  onAplicar?: (recaudoId: string) => void;
  aplicandoId?: string | null;
}) {
  const [ruidoVisible, setRuidoVisible] = React.useState(false);

  const ruido = resultado.detalles.filter(esRuidoDeCabecera);
  const reales = resultado.detalles.filter(d => !esRuidoDeCabecera(d));

  const duplicados =
    resultado.duplicados ?? reales.filter(d => d.tipo === "duplicado").length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Filas leídas", valor: resultado.procesadas, color: "text-zinc-900 dark:text-white" },
          { label: "Cargadas", valor: resultado.insertados, color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Ya existían", valor: duplicados, color: "text-blue-600 dark:text-blue-400" },
          { label: "Con problema", valor: resultado.errores, color: "text-amber-600 dark:text-amber-400" },
        ].map(item => (
          <div
            key={item.label}
            className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center"
          >
            <p className={`text-2xl font-extrabold ${item.color}`}>{item.valor}</p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-1">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {resultado.insertados > 0 && (
        <p className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Se cargaron {resultado.insertados} recaudos nuevos.
        </p>
      )}

      {reales.length === 0 && resultado.insertados === 0 && (
        <p className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <Info className="w-4 h-4 shrink-0" />
          No había nada nuevo que cargar en este archivo.
        </p>
      )}

      {grupos.map(grupo => {
        const items = reales.filter(d => d.tipo === grupo.tipo);
        if (items.length === 0) return null;

        return (
          <div key={grupo.tipo} className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={grupo.variante}>{items.length}</Badge>
              <span className="text-sm font-semibold text-zinc-900 dark:text-white">{grupo.titulo}</span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{grupo.ayuda}</p>

            <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
              {items.map((d, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-white">{d.error}</p>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono truncate">
                      {d.linea}
                    </p>
                  </div>
                  {d.tipo === "aplicacion" && d.recaudo_id && onAplicar && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAplicar(d.recaudo_id!)}
                      loading={aplicandoId === d.recaudo_id}
                    >
                      Aplicar
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {ruido.length > 0 && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setRuidoVisible(v => !v)}
            className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-3 h-3" />
            {ruido.length} {ruido.length === 1 ? "aviso ignorable" : "avisos ignorables"} de la
            cabecera del informe
          </button>
          {ruidoVisible && (
            <div className="mt-2 space-y-1.5">
              {ruido.map((d, i) => (
                <p key={i} className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono truncate">
                  {d.linea}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
