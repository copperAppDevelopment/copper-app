'use client';

import * as React from "react";
import { createPortal } from "react-dom";

/**
 * Pinta a sus hijos al final de `<body>`, fuera del árbol donde se montan.
 *
 * Las capas `fixed` lo necesitan: dentro de un ancestro con `transform` —el cajón del menú en
 * móvil— un `fixed` se posiciona respecto de ese ancestro y no de la pantalla. Espera a montar
 * porque en el servidor no hay `document`.
 */
export function Portal({ children }: { children: React.ReactNode }) {
  const [montado, setMontado] = React.useState(false);
  React.useEffect(() => setMontado(true), []);

  return montado ? createPortal(children, document.body) : null;
}
