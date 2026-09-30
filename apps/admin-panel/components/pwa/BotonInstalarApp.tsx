'use client';

import * as React from "react";
import { useState } from "react";
import { Download, Share, SquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useInstalarApp } from "@/hooks/useInstalarApp";

const PASOS_IOS = [
  { icono: <Share className="w-4 h-4" />, texto: "Toca el botón Compartir de Safari." },
  { icono: <SquarePlus className="w-4 h-4" />, texto: "Elige «Agregar a pantalla de inicio»." },
  { icono: <Download className="w-4 h-4" />, texto: "Confirma con «Agregar»." },
];

/**
 * «Instalar app» para el pie de los sidebars. No se muestra si ya está instalada o si el
 * navegador no permite instalarla. En iPhone/iPad, donde no se puede lanzar desde código,
 * explica cómo hacerlo a mano.
 */
export function BotonInstalarApp() {
  const { modo, instalar } = useInstalarApp();
  const [pasosAbiertos, setPasosAbiertos] = useState(false);

  if (modo === "oculto") return null;

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={modo === "nativo" ? instalar : () => setPasosAbiertos(true)}
        className="w-full justify-center"
        icon={<Download className="w-3.5 h-3.5" />}
      >
        Instalar app
      </Button>

      <Modal
        isOpen={pasosAbiertos}
        title="Instalar Copper"
        description="Safari no permite instalarla desde aquí, pero son tres pasos."
        onClose={() => setPasosAbiertos(false)}
      >
        <ol className="space-y-3">
          {PASOS_IOS.map((paso, i) => (
            <li key={paso.texto} className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
              <span className="w-7 h-7 shrink-0 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-xs">
                {i + 1}
              </span>
              <span className="text-brand">{paso.icono}</span>
              <span>{paso.texto}</span>
            </li>
          ))}
        </ol>
      </Modal>
    </>
  );
}
