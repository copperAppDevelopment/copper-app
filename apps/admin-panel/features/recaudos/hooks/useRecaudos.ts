'use client';

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useTablaLocal } from "@/hooks/useTablaLocal";
import { listarOpcionesApartamento, etiquetaApartamento, type ApartamentoOpcion } from "@/lib/apartamentos";
import * as api from "../api";
import { totalAplicado, estadoDe } from "../utils";
import type {
  Recaudo, Carga, FiltroEstado, ResultadoCarga, NuevoRecaudo,
} from "../types";

const PAGE_SIZE = 15;

export function useRecaudos(conjuntoId: string, sesionCargando: boolean) {
  const [loading, setLoading] = useState(true);
  const [recaudos, setRecaudos] = useState<Recaudo[]>([]);
  const [apartamentos, setApartamentos] = useState<ApartamentoOpcion[]>([]);
  const [cargas, setCargas] = useState<Carga[]>([]);
  const [error, setError] = useState("");

  const [filtro, setFiltro] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("todos");
  const [aplicandoId, setAplicandoId] = useState<string | null>(null);

  const recargar = useCallback(async (id: string) => {
    try {
      const [lista, historial] = await Promise.all([api.listarRecaudos(id), api.listarCargas(id)]);
      setRecaudos(lista);
      setCargas(historial);
      setError("");
    } catch (e) {
      console.error("Error al cargar recaudos:", e);
      setError("No se pudieron cargar los recaudos.");
    }
  }, []);

  useEffect(() => {
    if (sesionCargando || !conjuntoId) return;

    (async () => {
      setApartamentos(await listarOpcionesApartamento(conjuntoId));
      await recargar(conjuntoId);
      setLoading(false);
    })();
  }, [sesionCargando, conjuntoId, recargar]);

  const totalRecaudado = recaudos.reduce((s, r) => s + Number(r.valor_total ?? 0), 0);
  const totalAbonado = recaudos.reduce((s, r) => s + totalAplicado(r), 0);
  const indicadores = {
    totalRecaudado,
    totalAbonado,
    sinAbonar: totalRecaudado - totalAbonado,
    sinAplicar: recaudos.filter(r => totalAplicado(r) === 0).length,
    cantidad: recaudos.length,
  };

  const filtrados = React.useMemo(() => {
    const termino = filtro.trim().toLowerCase();
    return recaudos.filter(r => {
      if (filtroEstado !== "todos" && estadoDe(r) !== filtroEstado) return false;
      if (!termino) return true;
      return (
        (r.apartamentos?.numero_apartamento || "").toLowerCase().includes(termino) ||
        (r.referencia_1 || "").toLowerCase().includes(termino) ||
        (r.origen || "").toLowerCase().includes(termino)
      );
    });
  }, [recaudos, filtro, filtroEstado]);

  const tabla = useTablaLocal(filtrados, {
    pageSize: PAGE_SIZE,
    sortInicial: "fecha",
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

  const aplicar = async (recaudoId: string) => {
    setAplicandoId(recaudoId);
    setError("");
    try {
      await api.aplicarRecaudo(conjuntoId, recaudoId);
      await recargar(conjuntoId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAplicandoId(null);
    }
  };

  const crear = async (payload: NuevoRecaudo) => {
    await api.crearRecaudo(conjuntoId, {
      ...payload,
      referencia_1: apartamentos.find(a => a.id === payload.apartamento_id)?.numero_apartamento,
    });
    await recargar(conjuntoId);
  };

  const cargar = async (archivo: File, periodo: string):
    Promise<{ resultado: ResultadoCarga; cargaId: string | null }> => {
    const json = await api.cargarArchivo(conjuntoId, periodo, archivo);
    await recargar(conjuntoId);
    return { resultado: json.data.resultado, cargaId: json.data.carga?.id ?? null };
  };

  const reintentar = async (cargaId: string):
    Promise<{ resultado: ResultadoCarga; cargaId: string | null }> => {
    const json = await api.reintentarCarga(cargaId);
    await recargar(conjuntoId);
    return { resultado: json.data.resultado, cargaId: json.data.carga?.id ?? null };
  };

  const opcionesApartamento = [
    { value: "", label: "Selecciona un apartamento" },
    ...apartamentos.map(a => ({ value: a.id, label: etiquetaApartamento(a) })),
  ];

  return {
    loading,
    error,
    indicadores,
    filtro,
    cambiarFiltro,
    filtroEstado,
    cambiarEstado,
    tabla,
    cargas,
    opcionesApartamento,
    aplicandoId,
    aplicar,
    crear,
    cargar,
    reintentar,
  };
}
