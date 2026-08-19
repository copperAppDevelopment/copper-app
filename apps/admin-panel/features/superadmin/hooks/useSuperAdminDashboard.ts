'use client';

import { useState, useEffect } from "react";
import * as api from "../api";
import type { KpisSuperAdmin, SuscripcionReciente } from "../types";

export function useSuperAdminDashboard(sesionCargando: boolean) {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KpisSuperAdmin | null>(null);
  const [suscripciones, setSuscripciones] = useState<SuscripcionReciente[]>([]);

  useEffect(() => {
    if (sesionCargando) return;

    (async () => {
      const [k, s] = await Promise.all([
        api.obtenerKpis(),
        api.listarUltimasSuscripciones(),
      ]);
      setKpis(k);
      setSuscripciones(s);
      setLoading(false);
    })();
  }, [sesionCargando]);

  return { loading, kpis, suscripciones };
}
