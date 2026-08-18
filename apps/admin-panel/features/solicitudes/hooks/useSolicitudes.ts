'use client';

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useTablaLocal } from "@/hooks/useTablaLocal";
import { ESTADOS } from "@/lib/solicitudes";
import * as api from "../api";
import type {
  Solicitud, AdminAsignable, FiltroEstado, GestionSolicitud, ResultadoGestion,
} from "../types";

const PAGE_SIZE = 15;

export function useSolicitudes(conjuntoId: string, sesionCargando: boolean) {
  const [loading, setLoading] = useState(true);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [admins, setAdmins] = useState<AdminAsignable[]>([]);
  const [error, setError] = useState("");

  const [filtro, setFiltro] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("todos");

  const recargar = useCallback(async (id: string) => {
    try {
      setSolicitudes(await api.listarSolicitudes(id));
      setError("");
    } catch (e) {
      console.error("Error al cargar solicitudes:", e);
      setError("No se pudieron cargar las solicitudes.");
    }
  }, []);

  useEffect(() => {
    if (sesionCargando || !conjuntoId) return;

    (async () => {
      try {
        setAdmins(await api.listarAdminsAsignables(conjuntoId));
      } catch (e) {
        console.error("Error al cargar los admins asignables:", e);
      }
      await recargar(conjuntoId);
      setLoading(false);
    })();
  }, [sesionCargando, conjuntoId, recargar]);

  // Un contador por estado, más el total: son los indicadores de la cabecera.
  const indicadores = React.useMemo(() => {
    const base: Record<string, number> = Object.fromEntries(ESTADOS.map(e => [e, 0]));
    for (const s of solicitudes) {
      const estado = s.estado_solicitud ?? "";
      if (estado in base) base[estado] = (base[estado] ?? 0) + 1;
    }
    return { ...base, total: solicitudes.length };
  }, [solicitudes]);

  const filtradas = React.useMemo(() => {
    const termino = filtro.trim().toLowerCase();
    return solicitudes.filter(s => {
      if (filtroEstado !== "todos" && s.estado_solicitud !== filtroEstado) return false;
      if (!termino) return true;
      return (
        (s.titulo || "").toLowerCase().includes(termino) ||
        (s.nombre_residente || "").toLowerCase().includes(termino) ||
        (s.numero_apartamento || "").toLowerCase().includes(termino) ||
        (s.tipo_solicitud || "").toLowerCase().includes(termino)
      );
    });
  }, [solicitudes, filtro, filtroEstado]);

  const tabla = useTablaLocal(filtradas, {
    pageSize: PAGE_SIZE,
    sortInicial: "fecha_solicitud",
    ordenInicial: "desc",
  });

  const cambiarFiltro = (valor: string) => {
    setFiltro(valor);
    tabla.reiniciarPagina();
  };

  const cambiarEstado = (valor: FiltroEstado) => {
    setFiltroEstado(valor);
    tabla.reiniciarPagina();
  };

  const gestionar = async (payload: GestionSolicitud): Promise<ResultadoGestion> => {
    const json = await api.gestionarSolicitud(payload);
    await recargar(conjuntoId);
    return json.data;
  };

  return {
    loading,
    error,
    admins,
    indicadores,
    filtro,
    cambiarFiltro,
    filtroEstado,
    cambiarEstado,
    tabla,
    gestionar,
  };
}
