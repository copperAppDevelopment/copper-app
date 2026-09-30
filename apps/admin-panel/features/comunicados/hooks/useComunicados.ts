'use client';

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useTablaLocal } from "@/hooks/useTablaLocal";
import * as api from "../api";
import { dirigidoA } from "../types";
import type { Comunicado, TipoComunicado, TipoNovedad } from "../types";

export function useComunicados(conjuntoId: string, sesionCargando: boolean) {
  const [loading, setLoading] = useState(true);
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [error, setError] = useState("");
  const [operandoId, setOperandoId] = useState<string | null>(null);

  const [filtro, setFiltro] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<TipoComunicado | "">("");
  const [filtroNovedad, setFiltroNovedad] = useState<TipoNovedad | "">("");

  const recargar = useCallback(async () => {
    if (!conjuntoId) return;
    try {
      setComunicados(await api.listarComunicados(conjuntoId));
      setError("");
    } catch (e) {
      console.error("Error al cargar los comunicados:", e);
      setError("No se pudieron cargar los comunicados.");
    }
  }, [conjuntoId]);

  useEffect(() => {
    if (sesionCargando || !conjuntoId) return;
    (async () => {
      await recargar();
      setLoading(false);
    })();
  }, [sesionCargando, conjuntoId, recargar]);

  const filtrados = React.useMemo(() => {
    const termino = filtro.trim().toLowerCase();
    return comunicados.filter(c => {
      if (filtroTipo && c.tipo !== filtroTipo) return false;
      if (filtroNovedad && c.tipo_novedad !== filtroNovedad) return false;
      if (!termino) return true;
      return [c.titulo, c.descripcion, dirigidoA(c)]
        .some(texto => (texto ?? "").toLowerCase().includes(termino));
    });
  }, [comunicados, filtro, filtroTipo, filtroNovedad]);

  // Lo más reciente primero, como llega de la base.
  const tabla = useTablaLocal(filtrados, { sortInicial: "fecha_publicacion", ordenInicial: "desc" });

  const cambiarFiltro = (valor: string) => { setFiltro(valor); tabla.reiniciarPagina(); };
  const cambiarTipo = (valor: TipoComunicado | "") => { setFiltroTipo(valor); tabla.reiniciarPagina(); };
  const cambiarNovedad = (valor: TipoNovedad | "") => { setFiltroNovedad(valor); tabla.reiniciarPagina(); };

  const eliminar = async (comunicadoId: string) => {
    setOperandoId(comunicadoId);
    setError("");
    try {
      await api.eliminarComunicado(conjuntoId, comunicadoId);
      await recargar();
    } catch (err: any) {
      setError(err.message || "No se pudo eliminar el comunicado.");
    } finally {
      setOperandoId(null);
    }
  };

  /**
   * La pestaña se abre antes de pedir la URL: después de un `await` el navegador ya no lo
   * considera un clic del usuario y bloquea la ventana emergente.
   *
   * Lanza el error: el modal de detalle lo muestra junto al botón.
   */
  const abrirAdjunto = async (comunicadoId: string) => {
    const pestana = window.open("", "_blank");
    try {
      const url = await api.urlAdjunto(conjuntoId, comunicadoId);
      if (pestana) {
        pestana.opener = null;
        pestana.location.href = url;
      } else {
        window.location.href = url;
      }
    } catch (err) {
      pestana?.close();
      throw err;
    }
  };

  return {
    loading,
    error,
    total: comunicados.length,
    filtro,
    cambiarFiltro,
    filtroTipo,
    cambiarTipo,
    filtroNovedad,
    cambiarNovedad,
    tabla,
    operandoId,
    recargar,
    eliminar,
    abrirAdjunto,
  };
}
