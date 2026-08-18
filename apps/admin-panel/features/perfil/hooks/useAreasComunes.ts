'use client';

import { useState, useEffect, useCallback } from "react";
import * as api from "../adminApi";
import type { AreaComun, DatosArea } from "../adminTypes";

export function useAreasComunes(conjuntoId: string) {
  const [areas, setAreas] = useState<AreaComun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const recargar = useCallback(async (id: string) => {
    try {
      setAreas(await api.listarAreas(id));
      setError("");
    } catch (e) {
      console.error("Error al cargar las áreas comunes:", e);
      setError("No se pudieron cargar las áreas comunes.");
    }
  }, []);

  useEffect(() => {
    if (!conjuntoId) return;
    (async () => {
      await recargar(conjuntoId);
      setLoading(false);
    })();
  }, [conjuntoId, recargar]);

  const guardar = async (datos: DatosArea, areaId?: string) => {
    await api.guardarArea(conjuntoId, datos, areaId);
    await recargar(conjuntoId);
  };

  const borrar = async (areaId: string) => {
    await api.borrarArea(conjuntoId, areaId);
    await recargar(conjuntoId);
  };

  const alternar = async (area: AreaComun) => {
    setError("");
    try {
      await api.guardarArea(
        conjuntoId,
        { nombre: area.nombre, descripcion: area.descripcion ?? "", activa: !area.activa },
        area.id
      );
      await recargar(conjuntoId);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { areas, loading, error, setError, guardar, borrar, alternar };
}
