'use client';

import * as React from "react";
import { useRef } from "react";

export interface CodigoInputProps {
  valor: string;
  onChange: (valor: string) => void;
  disabled?: boolean;
}

const LARGO = 6;

/** Seis casillas para el código, con avance automático y pegado del código completo. */
export function CodigoInput({ valor, onChange, disabled = false }: CodigoInputProps) {
  const casillas = useRef<(HTMLInputElement | null)[]>([]);

  const escribir = (indice: number, texto: string) => {
    const digito = texto.replace(/\D/g, "").slice(-1);
    if (!digito) return;

    const siguiente = valor.padEnd(LARGO, " ").split("");
    siguiente[indice] = digito;
    onChange(siguiente.join("").trimEnd());

    if (indice < LARGO - 1) casillas.current[indice + 1]?.focus();
  };

  const teclear = (indice: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const siguiente = valor.padEnd(LARGO, " ").split("");

      // Si la casilla ya está vacía, se borra la anterior y el foco retrocede.
      if (!siguiente[indice]?.trim() && indice > 0) {
        siguiente[indice - 1] = " ";
        casillas.current[indice - 1]?.focus();
      } else {
        siguiente[indice] = " ";
      }
      onChange(siguiente.join("").trimEnd());
    }

    if (e.key === "ArrowLeft" && indice > 0) casillas.current[indice - 1]?.focus();
    if (e.key === "ArrowRight" && indice < LARGO - 1) casillas.current[indice + 1]?.focus();
  };

  const pegar = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pegado = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LARGO);
    if (!pegado) return;
    onChange(pegado);
    casillas.current[Math.min(pegado.length, LARGO - 1)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={pegar}>
      {Array.from({ length: LARGO }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { casillas.current[i] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={valor[i]?.trim() || ""}
          onChange={(e) => escribir(i, e.target.value)}
          onKeyDown={(e) => teclear(i, e)}
          disabled={disabled}
          aria-label={`Dígito ${i + 1} de ${LARGO}`}
          className="w-11 h-13 text-center text-lg font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:opacity-50"
        />
      ))}
    </div>
  );
}
