'use client';

import { useState, useEffect, useCallback } from "react";
import { useTablaLocal } from "@/hooks/useTablaLocal";
import * as api from "../api";
import type { KpisAdmin, Solicitud, PendientesConjunto } from "../types";

const PAGE_SIZE = 5;

export function useDashboard(conjuntoId: string, sesionCargando: boolean) {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KpisAdmin | null>(null);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [pendientes, setPendientes] = useState<PendientesConjunto | null>(null);

  /**
   * Vuelve a leerlo todo. La expone el hook porque el dashboard ya no es solo de lectura:
   * desde los accesos rápidos se crean apartamentos, y sin esto la lista de tareas seguiría
   * pidiendo que se creen.
   */
  const recargar = useCallback(async () => {
    if (!conjuntoId) return;

    const [k, s, p] = await Promise.all([
      api.obtenerKpis(conjuntoId),
      api.listarSolicitudes(conjuntoId),
      api.obtenerPendientes(conjuntoId),
    ]);
    setKpis(k);
    setSolicitudes(s);
    setPendientes(p);
  }, [conjuntoId]);

  useEffect(() => {
    if (sesionCargando || !conjuntoId) return;

    (async () => {
      await recargar();
      setLoading(false);
    })();
  }, [sesionCargando, conjuntoId, recargar]);

  // El dashboard no filtra: la tabla recibe la lista completa.
  const tabla = useTablaLocal(solicitudes, {
    pageSize: PAGE_SIZE,
    sortInicial: "fecha",
    ordenInicial: "desc",
  });

  return { loading, kpis, pendientes, tabla, recargar };
}
