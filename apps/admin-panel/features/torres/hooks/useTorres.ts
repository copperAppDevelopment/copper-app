'use client';

import { useState, useEffect, useCallback } from "react";
import * as api from "../api";
import type { BorradorTorre } from "@/lib/torres";
import type { TorreListado } from "../types";

/** Torres del conjunto y sus operaciones. Cada mutación recarga la lista. */
export function useTorres(conjuntoId: string) {
  const [torres, setTorres] = useState<TorreListado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const recargar = useCallback(async () => {
    if (!conjuntoId) return;
    try {
      setTorres(await api.listarTorres(conjuntoId));
      setError("");
    } catch (e) {
      console.error("Error al cargar las torres:", e);
      setError("No se pudieron cargar las torres.");
    } finally {
      setLoading(false);
    }
  }, [conjuntoId]);

  useEffect(() => { recargar(); }, [recargar]);

  const crear = async (borradores: BorradorTorre[]) => {
    const { data } = await api.crearTorres(conjuntoId, borradores);
    await recargar();

    // La ruta crea las torres una a una: puede haber salido bien solo una parte.
    if (data.fallidas?.length) {
      setError(
        data.fallidas.map((f: any) => `«${f.nombre}»: ${f.motivo}`).join(" · ")
      );
    } else {
      setExito(data.creadas === 1 ? "Torre creada." : `${data.creadas} torres creadas.`);
    }
  };

  const agregarPisos = async (torreId: string, pisos: number, aptosPorPiso: number) => {
    const { data } = await api.agregarPisos(conjuntoId, torreId, pisos, aptosPorPiso);
    await recargar();
    setExito(`Se añadieron ${data.apartamentos_creados} apartamentos.`);
  };

  const ajustarPiso = async (torreId: string, pisoId: string, objetivo: number) => {
    const resultado = await api.ajustarPiso(conjuntoId, torreId, pisoId, objetivo);
    await recargar();

    const partes = [
      resultado.creados ? `${resultado.creados} creados` : "",
      resultado.eliminados ? `${resultado.eliminados} eliminados` : "",
    ].filter(Boolean);

    setExito(partes.length ? `Piso actualizado: ${partes.join(" y ")}.` : "El piso ya estaba así.");
    return resultado;
  };

  const eliminar = async (torreId: string) => {
    await api.eliminarTorre(conjuntoId, torreId);
    await recargar();
    setExito("Torre eliminada.");
  };

  return {
    torres, loading, error, exito, setError, setExito,
    recargar, crear, agregarPisos, ajustarPiso, eliminar,
  };
}
