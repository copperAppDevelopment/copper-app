'use client';

import { useState, useEffect, useCallback } from "react";
import * as api from "../api";
import type { ConjuntoDetalle, DatosConjunto, SuscripcionActual } from "../types";

/**
 * Detalle de un conjunto: la vista con la suscripción y, aparte, los campos editables.
 *
 * Son dos consultas porque `vista_mis_conjuntos_con_suscripcion` no expone `foto_url`,
 * `codigo_municipio` ni `tiene_torres`, y el formulario de edición los necesita.
 *
 * Si la primera no devuelve nada es que el conjunto no es del usuario: la página lo trata
 * como un 404 en vez de enseñar datos ajenos.
 */
export function useConjuntoDetalle(conjuntoId: string, userId: string) {
  const [detalle, setDetalle] = useState<ConjuntoDetalle | null>(null);
  const [editables, setEditables] = useState<DatosConjunto | null>(null);
  const [suscripcion, setSuscripcion] = useState<SuscripcionActual | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sinAcceso, setSinAcceso] = useState(false);

  const recargar = useCallback(async () => {
    if (!conjuntoId || !userId) return;
    try {
      const fila = await api.obtenerDetalle(conjuntoId, userId);
      if (!fila) {
        setSinAcceso(true);
        return;
      }

      setDetalle(fila);
      setEditables(await api.obtenerEditables(conjuntoId));
      setSuscripcion(await api.suscripcionVigente(conjuntoId));
      setError("");
    } catch (e) {
      console.error("Error al cargar el conjunto:", e);
      setError("No se pudo cargar el conjunto.");
    } finally {
      setLoading(false);
    }
  }, [conjuntoId, userId]);

  useEffect(() => { recargar(); }, [recargar]);

  return { detalle, editables, suscripcion, loading, error, setError, sinAcceso, recargar };
}
