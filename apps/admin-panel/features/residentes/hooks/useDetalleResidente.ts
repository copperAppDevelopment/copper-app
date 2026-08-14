'use client';

import { useState, useEffect } from "react";
import * as api from "../api";
import type { ResidenteCompleto } from "../types";
import type {
  IndicadoresBalance, MovimientoBalance,
} from "@/components/balances/estado-de-cuenta";

export function useDetalleResidente(residenteId: string, sesionCargando: boolean) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [residente, setResidente] = useState<ResidenteCompleto | null>(null);
  const [activo, setActivo] = useState<boolean | null>(null);
  const [indicadores, setIndicadores] = useState<IndicadoresBalance | null>(null);
  const [movimientos, setMovimientos] = useState<MovimientoBalance[]>([]);

  useEffect(() => {
    if (sesionCargando) return;

    (async () => {
      if (!residenteId) {
        setError("Residente no encontrado.");
        setLoading(false);
        return;
      }

      try {
        const info = await api.obtenerResidenteCompleto(residenteId);
        if (!info) {
          setError("No se encontró el residente solicitado.");
          setLoading(false);
          return;
        }
        setResidente(info);
        setActivo(await api.obtenerActivo(residenteId));

        const balances = await api.obtenerBalances(residenteId);
        setIndicadores(balances.indicadores);
        setMovimientos(balances.movimientos);
      } catch (e) {
        console.error("Error al cargar el residente:", e);
        setError("No se encontró el residente solicitado.");
      } finally {
        setLoading(false);
      }
    })();
  }, [sesionCargando, residenteId]);

  return { loading, error, residente, activo, indicadores, movimientos };
}
