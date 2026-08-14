'use client';

import { useState, useEffect } from "react";
import { useTablaLocal } from "@/hooks/useTablaLocal";
import * as api from "../api";
import type { KpisAdmin, Solicitud } from "../types";

const PAGE_SIZE = 5;

export function useDashboard(conjuntoId: string, sesionCargando: boolean) {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KpisAdmin | null>(null);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);

  useEffect(() => {
    if (sesionCargando || !conjuntoId) return;

    (async () => {
      const [k, s] = await Promise.all([
        api.obtenerKpis(conjuntoId),
        api.listarSolicitudes(conjuntoId),
      ]);
      setKpis(k);
      setSolicitudes(s);
      setLoading(false);
    })();
  }, [sesionCargando, conjuntoId]);

  // El dashboard no filtra: la tabla recibe la lista completa.
  const tabla = useTablaLocal(solicitudes, {
    pageSize: PAGE_SIZE,
    sortInicial: "fecha",
    ordenInicial: "desc",
  });

  return { loading, kpis, tabla };
}
