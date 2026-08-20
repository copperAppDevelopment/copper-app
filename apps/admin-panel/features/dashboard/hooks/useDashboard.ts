'use client';

import { useState, useEffect } from "react";
import { useTablaLocal } from "@/hooks/useTablaLocal";
import * as api from "../api";
import type { KpisAdmin, Solicitud, PendientesConjunto } from "../types";

const PAGE_SIZE = 5;

export function useDashboard(conjuntoId: string, sesionCargando: boolean) {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KpisAdmin | null>(null);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [pendientes, setPendientes] = useState<PendientesConjunto | null>(null);

  useEffect(() => {
    if (sesionCargando || !conjuntoId) return;

    (async () => {
      const [k, s, p] = await Promise.all([
        api.obtenerKpis(conjuntoId),
        api.listarSolicitudes(conjuntoId),
        api.obtenerPendientes(conjuntoId),
      ]);
      setKpis(k);
      setSolicitudes(s);
      setPendientes(p);
      setLoading(false);
    })();
  }, [sesionCargando, conjuntoId]);

  // El dashboard no filtra: la tabla recibe la lista completa.
  const tabla = useTablaLocal(solicitudes, {
    pageSize: PAGE_SIZE,
    sortInicial: "fecha",
    ordenInicial: "desc",
  });

  return { loading, kpis, pendientes, tabla };
}
