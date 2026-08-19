'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import { useTablaLocal } from "@/hooks/useTablaLocal";
import * as api from "../api";
import type { ConjuntoSuper } from "../types";

const PAGE_SIZE = 10;

/** Todos los conjuntos de la plataforma, con el interruptor de acceso. */
export function useConjuntosSuper(sesionCargando: boolean) {
  const [conjuntos, setConjuntos] = useState<ConjuntoSuper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const recargar = useCallback(async () => {
    try {
      setConjuntos(await api.listarConjuntosSuper());
      setError("");
    } catch (e: any) {
      console.error("Error al cargar los conjuntos:", e);
      setError("No se pudieron cargar los conjuntos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sesionCargando) return;
    recargar();
  }, [sesionCargando, recargar]);

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return conjuntos;
    return conjuntos.filter(c =>
      [c.nombre_conjunto, c.ciudad, c.propietario_nombre, c.propietario_email]
        .some(v => (v ?? "").toLowerCase().includes(texto))
    );
  }, [conjuntos, busqueda]);

  const tabla = useTablaLocal(filtrados, {
    pageSize: PAGE_SIZE,
    sortInicial: "nombre_conjunto",
    ordenInicial: "asc",
  });

  const contadores = useMemo(() => ({
    total: conjuntos.length,
    activos: conjuntos.filter(c => c.activo).length,
    inactivos: conjuntos.filter(c => !c.activo).length,
    residentes: conjuntos.reduce((suma, c) => suma + Number(c.num_residentes ?? 0), 0),
  }), [conjuntos]);

  const cambiarActivo = async (conjunto: ConjuntoSuper, activo: boolean) => {
    setError("");
    setAviso("");
    try {
      const r = await api.cambiarActivoConjunto(conjunto.conjunto_id, activo);
      await recargar();
      setAviso(
        activo
          ? `${r.conjunto} vuelve a estar activo.`
          : `${r.conjunto} quedó desactivado: ${r.residentes_afectados} residentes pierden el acceso a la app.`
      );
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  return {
    conjuntos: filtrados, loading, error, setError, aviso, setAviso,
    busqueda, setBusqueda, tabla, contadores, recargar, cambiarActivo,
  };
}

export type EstadoConjuntosSuper = ReturnType<typeof useConjuntosSuper>;
