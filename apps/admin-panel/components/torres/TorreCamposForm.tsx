'use client';

import * as React from "react";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  MAX_PISOS, MAX_APTOS_PISO, previsualizarNumeracion, totalApartamentos,
} from "@/lib/torres";
import type { BorradorTorre } from "@/lib/torres";

export interface TorreCamposFormProps {
  borrador: BorradorTorre;
  onCambiar: (borrador: BorradorTorre) => void;
  /** Si se pasa, se muestra el botón de quitar (en la lista del alta de conjunto). */
  onQuitar?: () => void;
  disabled?: boolean;
  /** Distingue los `id` cuando hay varios formularios en la misma página. */
  indice?: number;
}

/**
 * Campos de una torre: nombre, prefijo, pisos y apartamentos por piso.
 *
 * Vive en `components/` y no en una feature porque lo usan dos —el módulo de torres y el
 * alta de conjunto— y una feature nunca importa de otra.
 *
 * La previsualización no es decorativa: la numeración depende del prefijo y del piso
 * (`A-101`, `A-201`), y a partir del piso 10 son cuatro dígitos. Verlo antes de confirmar
 * evita descubrirlo con 200 apartamentos ya creados.
 */
export function TorreCamposForm({
  borrador,
  onCambiar,
  onQuitar,
  disabled = false,
  indice = 0,
}: TorreCamposFormProps) {
  const cambiar = <K extends keyof BorradorTorre>(clave: K, valor: BorradorTorre[K]) =>
    onCambiar({ ...borrador, [clave]: valor });

  const muestra = previsualizarNumeracion(borrador);
  const total = totalApartamentos(borrador);

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
      <div className="flex items-start gap-4">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              id={`torre-nombre-${indice}`}
              label="Nombre de la torre"
              placeholder="Torre A"
              value={borrador.nombre}
              onChange={(e) => cambiar("nombre", e.target.value)}
              disabled={disabled}
            />
          </div>

          <Input
            id={`torre-prefijo-${indice}`}
            label="Prefijo"
            placeholder="A"
            maxLength={4}
            value={borrador.prefijo}
            onChange={(e) => cambiar("prefijo", e.target.value.toUpperCase())}
            disabled={disabled}
            helperText="1 a 4 letras o dígitos."
          />
        </div>

        {onQuitar && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onQuitar}
            disabled={disabled}
            className="mt-6 shrink-0"
            icon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Quitar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id={`torre-pisos-${indice}`}
          label="Pisos"
          type="number"
          min={1}
          max={MAX_PISOS}
          placeholder="5"
          value={borrador.num_pisos}
          onChange={(e) => cambiar("num_pisos", e.target.value)}
          disabled={disabled}
        />

        <Input
          id={`torre-aptos-${indice}`}
          label="Apartamentos por piso"
          type="number"
          min={1}
          max={MAX_APTOS_PISO}
          placeholder="4"
          value={borrador.aptos_por_piso}
          onChange={(e) => cambiar("aptos_por_piso", e.target.value)}
          disabled={disabled}
        />
      </div>

      {muestra.length > 0 && (
        <div className="rounded-xl bg-zinc-50 dark:bg-zinc-850 px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Se generarán {total} apartamentos
          </p>
          <p className="font-mono text-xs text-zinc-600 dark:text-zinc-300">
            {muestra.join(", ")}
            {total > muestra.length ? "…" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
