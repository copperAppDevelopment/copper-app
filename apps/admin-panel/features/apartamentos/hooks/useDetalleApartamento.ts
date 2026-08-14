'use client';

import { useState, useEffect } from "react";
import * as api from "../api";
import type { DetalleApt, ResidenteApt, Indicadores, Movimiento } from "../types";

export function useDetalleApartamento(apartamentoId: string, sesionCargando: boolean) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detalle, setDetalle] = useState<DetalleApt | null>(null);
  const [residentes, setResidentes] = useState<ResidenteApt[]>([]);
  const [indicadores, setIndicadores] = useState<Indicadores | null>(null);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);

  useEffect(() => {
    if (sesionCargando) return;

    (async () => {
      if (!apartamentoId) {
        setError("Apartamento no encontrado.");
        setLoading(false);
        return;
      }

      try {
        const info = await api.obtenerDetalle(apartamentoId);
        if (!info) {
          setError("No se encontró el apartamento solicitado.");
          setLoading(false);
          return;
        }
        setDetalle(info);

        const lista = await api.listarResidentesDe(apartamentoId);
        setResidentes(lista);

        const balances = await api.obtenerBalances(apartamentoId, lista);
        setIndicadores(balances.indicadores);
        setMovimientos(balances.movimientos);
      } catch (e) {
        console.error("Error al cargar el detalle del apartamento:", e);
        setError("No se encontró el apartamento solicitado.");
      } finally {
        setLoading(false);
      }
    })();
  }, [sesionCargando, apartamentoId]);

  return { loading, error, detalle, residentes, indicadores, movimientos };
}
