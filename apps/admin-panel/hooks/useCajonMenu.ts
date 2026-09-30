'use client';

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Estado del menú lateral en pantallas angostas, donde el sidebar vive en un cajón.
 *
 * Se cierra solo al cambiar de ruta: así cualquier enlace del menú lo cierra sin que los
 * sidebars sepan que están dentro de un cajón.
 */
export function useCajonMenu() {
  const [abierto, setAbierto] = useState(false);
  const ruta = usePathname();

  const abrir = useCallback(() => setAbierto(true), []);
  const cerrar = useCallback(() => setAbierto(false), []);

  useEffect(() => setAbierto(false), [ruta]);

  useEffect(() => {
    if (!abierto) return;

    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    document.addEventListener("keydown", alPresionar);

    // La página de fondo no se desplaza mientras el menú la tapa.
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", alPresionar);
      document.body.style.overflow = overflowPrevio;
    };
  }, [abierto]);

  return { abierto, abrir, cerrar };
}
