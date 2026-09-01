'use client';

import { useState, useEffect, useCallback } from "react";
import * as api from "../api";
import type { Torre } from "../types";

/**
 * Lo mínimo para abrir `CrearApartamentoModal` fuera de la página de apartamentos.
 *
 * `useApartamentos` también da `torres` y `crear`, pero de paso trae la tabla entera y la
 * pagina: en el dashboard eso es una consulta grande para un formulario que solo necesita el
 * selector de torres.
 */
export function useCrearApartamento(conjuntoId: string, activo: boolean) {
  const [torres, setTorres] = useState<Torre[]>([]);

  useEffect(() => {
    if (!activo || !conjuntoId) return;

    let cancelado = false;
    api.listarTorres(conjuntoId)
      .then(lista => { if (!cancelado) setTorres(lista); })
      .catch(e => console.error("Error al cargar las torres:", e));

    return () => { cancelado = true; };
  }, [activo, conjuntoId]);

  const crear = useCallback(
    async (payload: { numero_apartamento: string; direccion: string; torre_id: string }) => {
      await api.crearApartamento({
        conjunto_id: conjuntoId,
        numero_apartamento: payload.numero_apartamento,
        direccion: payload.direccion,
        torre_id: payload.torre_id || null,
      });
    },
    [conjuntoId]
  );

  return { torres, crear };
}
