'use client';

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useTablaLocal } from "@/hooks/useTablaLocal";
import * as api from "../api";
import type { Apartamento, Torre } from "../types";

/**
 * CommonTable pinta todos los números de página sin elipsis, así que un pageSize pequeño
 * produce decenas de botones en conjuntos grandes.
 */
const PAGE_SIZE = 15;

export function useApartamentos(conjuntoId: string, sesionCargando: boolean) {
  const [loading, setLoading] = useState(true);
  const [apartamentos, setApartamentos] = useState<Apartamento[]>([]);
  const [torres, setTorres] = useState<Torre[]>([]);
  const [error, setError] = useState("");

  const [filtro, setFiltro] = useState("");

  const recargar = useCallback(async (id: string) => {
    try {
      setApartamentos(await api.listarApartamentos(id));
      setError("");
    } catch (e) {
      console.error("Error al cargar apartamentos:", e);
      setError("No se pudieron cargar los apartamentos.");
    }
  }, []);

  useEffect(() => {
    if (sesionCargando || !conjuntoId) return;

    (async () => {
      setTorres(await api.listarTorres(conjuntoId));
      await recargar(conjuntoId);
      setLoading(false);
    })();
  }, [sesionCargando, conjuntoId, recargar]);

  // Indicadores derivados del mismo array que alimenta la tabla, para que nunca
  // puedan contradecirse entre sí.
  const total = apartamentos.length;
  const ocupados = apartamentos.filter(a => a.ocupado).length;
  const indicadores = {
    total,
    ocupados,
    vacios: total - ocupados,
    porcentajeOcupacion: total > 0 ? Math.round((ocupados / total) * 100) : 0,
  };

  const filtrados = React.useMemo(() => {
    const termino = filtro.trim().toLowerCase();
    if (!termino) return apartamentos;
    return apartamentos.filter(a =>
      (a.numero_apartamento || "").toLowerCase().includes(termino)
    );
  }, [apartamentos, filtro]);

  const tabla = useTablaLocal(filtrados, {
    pageSize: PAGE_SIZE,
    // Por la clave compuesta y no por `numero_apartamento_num`: ese campo vale 101 tanto
    // para `A-101` como para `B-101` y mezclaría las torres.
    sortInicial: "clave_orden",
    ordenInicial: "asc",
  });

  const cambiarFiltro = (valor: string) => {
    setFiltro(valor);
    tabla.reiniciarPagina();
  };

  const crear = async (payload: { numero_apartamento: string; direccion: string; torre_id: string }) => {
    await api.crearApartamento({
      conjunto_id: conjuntoId,
      numero_apartamento: payload.numero_apartamento,
      direccion: payload.direccion,
      torre_id: payload.torre_id || null,
    });
    await recargar(conjuntoId);
  };

  const generar = async (payload: { prefijo: string; cantidad: number; direccion_base: string }) => {
    await api.generarApartamentos({ conjunto_id: conjuntoId, ...payload });
    await recargar(conjuntoId);
  };

  return {
    loading,
    error,
    torres,
    indicadores,
    filtro,
    cambiarFiltro,
    tabla,
    conjuntoVacio: total === 0,
    crear,
    generar,
  };
}
