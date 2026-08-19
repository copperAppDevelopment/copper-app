'use client';

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useTablaLocal } from "@/hooks/useTablaLocal";
import { listarOpcionesApartamento, etiquetaApartamento, type ApartamentoOpcion } from "@/lib/apartamentos";
import * as api from "../api";
import type { Residente, FiltroEstado, UsuarioExistente } from "../types";

const PAGE_SIZE = 15;

export function useResidentes(conjuntoId: string, sesionCargando: boolean) {
  const [loading, setLoading] = useState(true);
  const [residentes, setResidentes] = useState<Residente[]>([]);
  const [apartamentos, setApartamentos] = useState<ApartamentoOpcion[]>([]);
  const [error, setError] = useState("");

  const [filtro, setFiltro] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("todos");

  const recargar = useCallback(async (id: string) => {
    try {
      const [lista, aptos] = await Promise.all([
        api.listarResidentes(id),
        listarOpcionesApartamento(id),
      ]);
      setResidentes(lista);
      setApartamentos(aptos);
      setError("");
    } catch (e) {
      console.error("Error al cargar residentes:", e);
      setError("No se pudieron cargar los residentes.");
    }
  }, []);

  useEffect(() => {
    if (sesionCargando || !conjuntoId) return;

    (async () => {
      await recargar(conjuntoId);
      setLoading(false);
    })();
  }, [sesionCargando, conjuntoId, recargar]);

  const total = residentes.length;
  const indicadores = {
    total,
    activos: residentes.filter(r => r.activo).length,
    pendientes: residentes.filter(r => r.activo && !r.apartamento_id).length,
  };

  const filtrados = React.useMemo(() => {
    const termino = filtro.trim().toLowerCase();

    return residentes.filter(r => {
      if (filtroEstado === "activos" && !r.activo) return false;
      if (filtroEstado === "inactivos" && r.activo) return false;
      if (filtroEstado === "pendientes" && !(r.activo && !r.apartamento_id)) return false;

      if (!termino) return true;
      return (
        (r.nombre_completo || "").toLowerCase().includes(termino) ||
        (r.email || "").toLowerCase().includes(termino) ||
        (r.documento || "").toLowerCase().includes(termino)
      );
    });
  }, [residentes, filtro, filtroEstado]);

  const tabla = useTablaLocal(filtrados, {
    pageSize: PAGE_SIZE,
    sortInicial: "nombre_completo",
    ordenInicial: "asc",
  });

  const cambiarFiltro = (valor: string) => {
    setFiltro(valor);
    tabla.reiniciarPagina();
  };

  const cambiarEstado = (valor: FiltroEstado) => {
    setFiltroEstado(valor);
    tabla.reiniciarPagina();
  };

  /** Devuelve el usuario existente si el correo ya tenía cuenta; `null` si se invitó. */
  const invitar = async (payload: { email: string; telefono: string; apartamento_id: string }):
    Promise<{ usuarioExistente: UsuarioExistente | null; mensaje: string | null }> => {
    const json = await api.invitar({
      conjunto_id: conjuntoId,
      email: payload.email,
      telefono: payload.telefono || null,
      apartamento_id: payload.apartamento_id || null,
    });

    if (json.data?.yaRegistrado) {
      if (json.data.residenteExistente?.activo) {
        throw new Error("Este usuario ya es residente activo de este conjunto.");
      }
      return { usuarioExistente: json.data.usuario, mensaje: null };
    }

    return { usuarioExistente: null, mensaje: json.message || "Invitación enviada correctamente." };
  };

  const vincular = async (userId: string, apartamentoId: string) => {
    await api.vincular({
      conjunto_id: conjuntoId,
      user_id: userId,
      apartamento_id: apartamentoId || null,
    });
    await recargar(conjuntoId);
  };

  const asignar = async (residenteId: string, apartamentoId: string) => {
    await api.asignarApartamento({
      conjunto_id: conjuntoId,
      residente_id: residenteId,
      apartamento_id: apartamentoId,
    });
    await recargar(conjuntoId);
  };

  const remover = async (residenteId: string) => {
    await api.removerApartamento({ conjunto_id: conjuntoId, residente_id: residenteId });
    await recargar(conjuntoId);
  };

  /** Opciones del desplegable de apartamentos, marcando los ocupados. */
  const opcionesApartamento = [
    { value: "", label: "Sin asignar" },
    ...apartamentos.map(a => ({
      value: a.id,
      label: a.ocupado ? `${etiquetaApartamento(a)} (ocupado)` : etiquetaApartamento(a),
    })),
  ];

  return {
    loading,
    error,
    setError,
    indicadores,
    filtro,
    cambiarFiltro,
    filtroEstado,
    cambiarEstado,
    tabla,
    opcionesApartamento,
    invitar,
    vincular,
    asignar,
    remover,
  };
}
