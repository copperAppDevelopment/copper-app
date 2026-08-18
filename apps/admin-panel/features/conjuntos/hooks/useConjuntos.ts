'use client';

import { useState, useEffect, useCallback } from "react";
import * as api from "../api";
import type { ConjuntoListado } from "../types";

/** Lista de conjuntos del administrador, incluidos los pendientes de pago. */
export function useConjuntos(userId: string) {
  const [conjuntos, setConjuntos] = useState<ConjuntoListado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const recargar = useCallback(async () => {
    if (!userId) return;
    try {
      setConjuntos(await api.listarConjuntos(userId));
      setError("");
    } catch (e) {
      console.error("Error al cargar los conjuntos:", e);
      setError("No se pudieron cargar tus conjuntos.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { recargar(); }, [recargar]);

  return { conjuntos, loading, error, setError, recargar };
}
