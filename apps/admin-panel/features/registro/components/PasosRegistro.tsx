import * as React from "react";
import { Check } from "lucide-react";
import { PASOS } from "../types";
import type { PasoRegistro } from "../types";

/** El indicador de progreso: en qué paso va y cuáles quedan. */
export function PasosRegistro({ actual }: { actual: PasoRegistro }) {
  // «listo» va después del último, así que cuenta como todos hechos.
  const indice = actual === "listo" ? PASOS.length : PASOS.findIndex(p => p.clave === actual);

  return (
    <ol className="flex flex-col sm:flex-row gap-3 sm:gap-0">
      {PASOS.map((paso, i) => {
        const hecho = i < indice;
        const enCurso = i === indice;

        return (
          <li key={paso.clave} className="flex-1 flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                hecho
                  ? "bg-emerald-500 text-white"
                  : enCurso
                    ? "bg-brand text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"
              }`}
            >
              {hecho ? <Check className="w-4 h-4" /> : i + 1}
            </div>

            <div className="min-w-0">
              <p
                className={`text-xs font-bold ${
                  enCurso ? "text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {paso.titulo}
              </p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">
                {paso.descripcion}
              </p>
            </div>

            {i < PASOS.length - 1 && (
              <div className="hidden sm:block flex-1 h-px bg-zinc-200 dark:bg-zinc-800 mx-3" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
