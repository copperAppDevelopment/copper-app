'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import { useTablaLocal } from "@/hooks/useTablaLocal";
import * as api from "../api";
import type { FilaAsignacion } from "../types";

const PAGE_SIZE = 10;

/** Listado de conjuntos con su suscripción vigente, con búsqueda y recarga. */
export function useAsignacionPlanes(sesionCargando: boolean) {
  const [filas, setFilas] = useState<FilaAsignacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const recargar = useCallback(async () => {
    try {
      setFilas(await api.listarAsignaciones());
      setError("");
    } catch (e: any) {
      console.error("Error al cargar la asignación de planes:", e);
      setError("No se pudo cargar la lista de conjuntos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sesionCargando) return;
    recargar();
  }, [sesionCargando, recargar]);

  const filtradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return filas;
    return filas.filter(f =>
      [f.nombre_conjunto, f.ciudad, f.propietario_nombre, f.propietario_email]
        .some(v => (v ?? "").toLowerCase().includes(texto))
    );
  }, [filas, busqueda]);

  const tabla = useTablaLocal(filtradas, {
    pageSize: PAGE_SIZE,
    sortInicial: "nombre_conjunto",
    ordenInicial: "asc",
  });

  const revocar = async (fila: FilaAsignacion) => {
    if (!fila.suscripcion_id) return;
    setError("");
    setAviso("");
    try {
      await api.revocarSuscripcion(fila.suscripcion_id);
      setAviso(`Se cortó la suscripción de ${fila.nombre_conjunto}.`);
      await recargar();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    filas: filtradas, loading, error, setError, aviso, setAviso,
    busqueda, setBusqueda, tabla, recargar, revocar,
  };
}

export type EstadoAsignacion = ReturnType<typeof useAsignacionPlanes>;
