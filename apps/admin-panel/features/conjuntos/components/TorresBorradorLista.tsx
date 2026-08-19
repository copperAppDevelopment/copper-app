'use client';

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { TorreCamposForm } from "@/components/torres/TorreCamposForm";
import { TORRE_VACIA } from "@/lib/torres";
import type { BorradorTorre } from "@/lib/torres";

export interface TorresBorradorListaProps {
  borradores: BorradorTorre[];
  onCambiar: (borradores: BorradorTorre[]) => void;
  disabled?: boolean;
}

/**
 * Torres que se crearán junto con el conjunto.
 *
 * Solo aparece al dar de alta: las torres de un conjunto que ya existe se gestionan desde
 * `/admin/torres`, para que la escritura tenga una sola puerta.
 */
export function TorresBorradorLista({
  borradores,
  onCambiar,
  disabled = false,
}: TorresBorradorListaProps) {
  const actualizar = (indice: number, borrador: BorradorTorre) =>
    onCambiar(borradores.map((b, i) => (i === indice ? borrador : b)));

  const quitar = (indice: number) =>
    onCambiar(borradores.filter((_, i) => i !== indice));

  const agregar = () => {
    // La siguiente letra del abecedario como sugerencia: A, B, C…
    const sugerido = String.fromCharCode(65 + borradores.length);
    onCambiar([
      ...borradores,
      { ...TORRE_VACIA, nombre: `Torre ${sugerido}`, prefijo: sugerido },
    ]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Torres
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={agregar}
          disabled={disabled}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          Añadir torre
        </Button>
      </div>

      {borradores.length === 0 ? (
        <Alert variant="info">
          Añade las torres ahora y se crearán con sus pisos y apartamentos. También puedes
          dejarlo para después, desde el módulo de Torres.
        </Alert>
      ) : (
        borradores.map((borrador, indice) => (
          <TorreCamposForm
            key={indice}
            indice={indice}
            borrador={borrador}
            onCambiar={(nuevo) => actualizar(indice, nuevo)}
            onQuitar={() => quitar(indice)}
            disabled={disabled}
          />
        ))
      )}
    </div>
  );
}
