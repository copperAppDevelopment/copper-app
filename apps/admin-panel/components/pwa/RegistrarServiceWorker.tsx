'use client';

import { useEffect } from "react";

/**
 * Registra `public/sw.js`. Solo en producción: en `next dev` un service worker se interpone
 * con la recarga en caliente.
 */
export function RegistrarServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.error("No se pudo registrar el service worker:", error);
    });
  }, []);

  return null;
}
