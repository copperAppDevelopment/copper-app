'use client';

import { useCallback, useEffect, useState } from "react";

/** El evento de Chromium; no está en los tipos del DOM porque no es estándar. */
interface EventoInstalacion extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * - `nativo`: el navegador permite instalar desde código (Chrome, Edge, Android).
 * - `ios`: Safari en iPhone/iPad, que solo instala a mano desde Compartir.
 * - `oculto`: ya está instalada o el navegador no lo permite (Firefox de escritorio, etc.).
 */
export type ModoInstalacion = "oculto" | "nativo" | "ios";

const esIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  // El iPad con iPadOS 13+ se anuncia como Mac; se distingue por la pantalla táctil.
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const yaInstalada = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

export function useInstalarApp() {
  const [evento, setEvento] = useState<EventoInstalacion | null>(null);
  const [instalada, setInstalada] = useState(true);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    setInstalada(yaInstalada());
    setIos(esIOS());

    const alOfrecer = (e: Event) => {
      // Sin esto el navegador muestra su propio aviso; se guarda para lanzarlo desde el botón.
      e.preventDefault();
      setEvento(e as EventoInstalacion);
    };
    const alInstalar = () => {
      setInstalada(true);
      setEvento(null);
    };

    window.addEventListener("beforeinstallprompt", alOfrecer);
    window.addEventListener("appinstalled", alInstalar);
    return () => {
      window.removeEventListener("beforeinstallprompt", alOfrecer);
      window.removeEventListener("appinstalled", alInstalar);
    };
  }, []);

  const instalar = useCallback(async () => {
    if (!evento) return;
    await evento.prompt();
    await evento.userChoice;
    // El evento solo sirve una vez; si lo rechazó, el navegador vuelve a emitirlo más adelante.
    setEvento(null);
  }, [evento]);

  const modo: ModoInstalacion =
    instalada ? "oculto" : evento ? "nativo" : ios ? "ios" : "oculto";

  return { modo, instalar };
}
