'use client';

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useTablaLocal } from "@/hooks/useTablaLocal";
import * as api from "../api";
import { estadoDe } from "../types";
import type { Invitacion, InvitacionConEstado, FiltroEstado, EstadoInvitacion } from "../types";

export function useInvitaciones(conjuntoId: string, sesionCargando: boolean) {
  const [loading, setLoading] = useState(true);
  const [invitaciones, setInvitaciones] = useState<Invitacion[]>([]);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [operandoId, setOperandoId] = useState<string | null>(null);

  const [filtro, setFiltro] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("todas");

  const recargar = useCallback(async () => {
    if (!conjuntoId) return;
    try {
      setInvitaciones(await api.listarInvitaciones(conjuntoId));
      setError("");
    } catch (e: any) {
      console.error("Error al cargar las invitaciones:", e);
      setError(e.message || "No se pudieron cargar las invitaciones.");
    }
  }, [conjuntoId]);

  useEffect(() => {
    if (sesionCargando || !conjuntoId) return;
    (async () => {
      await recargar();
      setLoading(false);
    })();
  }, [sesionCargando, conjuntoId, recargar]);

  // El estado se calcula una vez por carga: «vencida» depende de la hora, no de la base.
  const conEstado = React.useMemo(
    (): InvitacionConEstado[] => invitaciones.map(i => ({ ...i, estado: estadoDe(i) })),
    [invitaciones]
  );

  const conteo = React.useMemo(() => {
    const base: Record<EstadoInvitacion, number> = { pendiente: 0, vencida: 0, aceptada: 0, error: 0 };
    for (const i of conEstado) base[i.estado] += 1;
    return base;
  }, [conEstado]);

  const filtrados = React.useMemo(() => {
    const termino = filtro.trim().toLowerCase();
    return conEstado.filter(i => {
      if (filtroEstado !== "todas" && i.estado !== filtroEstado) return false;
      if (!termino) return true;
      return [i.email, i.numero_apartamento, i.telefono]
        .some(t => (t ?? "").toLowerCase().includes(termino));
    });
  }, [conEstado, filtro, filtroEstado]);

  const tabla = useTablaLocal(filtrados, { sortInicial: "creado_en", ordenInicial: "desc" });

  const cambiarFiltro = (valor: string) => { setFiltro(valor); tabla.reiniciarPagina(); };
  const cambiarEstado = (valor: FiltroEstado) => { setFiltroEstado(valor); tabla.reiniciarPagina(); };

  const reenviar = async (inv: Invitacion) => {
    setOperandoId(inv.id);
    setError("");
    setAviso("");
    try {
      await api.reenviarInvitacion(conjuntoId, inv.id);
      setAviso(`Se reenvió la invitación a ${inv.email}. Vence en 7 días.`);
    } catch (err: any) {
      setError(err.message || "No se pudo reenviar la invitación.");
    } finally {
      // Se recarga también si falló: el error de envío queda anotado en la fila.
      await recargar();
      setOperandoId(null);
    }
  };

  return {
    loading,
    error,
    aviso,
    setAviso,
    conteo,
    total: invitaciones.length,
    filtro,
    cambiarFiltro,
    filtroEstado,
    cambiarEstado,
    tabla,
    operandoId,
    recargar,
    reenviar,
  };
}
