'use client';

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useTablaLocal } from "@/hooks/useTablaLocal";
import { listarOpcionesApartamento, etiquetaApartamento, type ApartamentoOpcion } from "@/lib/apartamentos";
import * as api from "../api";
import {
  totalAplicado, estadoDe, periodoActual, anioMesDe, campoDePeriodo, etiquetaPeriodo,
} from "../utils";
import type {
  Recaudo, Carga, FiltroEstado, BasePeriodo, ResultadoCarga, NuevoRecaudo,
} from "../types";

const PAGE_SIZE = 15;

/** El mes en curso, partido, que es con lo que abre la página. */
const HOY = periodoActual();
const ANIO_ACTUAL = HOY.slice(0, 4);
const MES_ACTUAL = HOY.slice(5, 7);

export function useRecaudos(conjuntoId: string, sesionCargando: boolean) {
  const [loading, setLoading] = useState(true);
  const [recaudos, setRecaudos] = useState<Recaudo[]>([]);
  const [apartamentos, setApartamentos] = useState<ApartamentoOpcion[]>([]);
  const [cargas, setCargas] = useState<Carga[]>([]);
  const [error, setError] = useState("");

  const [filtro, setFiltro] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("todos");
  const [aplicandoId, setAplicandoId] = useState<string | null>(null);

  // La página abre por el mes en curso, no por el histórico completo.
  const [anio, setAnio] = useState(ANIO_ACTUAL);
  const [mes, setMes] = useState(MES_ACTUAL);
  // Por `fecha` y no por `periodo`: al entrar interesa lo que entró en caja este mes. El
  // selector deja cambiar al mes contable, que es otra pregunta.
  const [basePeriodo, setBasePeriodo] = useState<BasePeriodo>("fecha");

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

  // Primera etapa: el periodo. De aquí cuelgan los indicadores, para que los totales del mes
  // no se muevan mientras se busca un apartamento dentro de él.
  const enPeriodo = React.useMemo(() => {
    if (!anio && !mes) return recaudos;
    return recaudos.filter(r => {
      const partes = anioMesDe(campoDePeriodo(r, basePeriodo));
      if (!partes) return false;
      if (anio && partes.anio !== anio) return false;
      if (mes && partes.mes !== mes) return false;
      return true;
    });
  }, [recaudos, anio, mes, basePeriodo]);

  const indicadores = React.useMemo(() => {
    const totalRecaudado = enPeriodo.reduce((s, r) => s + Number(r.valor_total ?? 0), 0);
    const totalAbonado = enPeriodo.reduce((s, r) => s + totalAplicado(r), 0);
    return {
      totalRecaudado,
      totalAbonado,
      sinAbonar: totalRecaudado - totalAbonado,
      sinAplicar: enPeriodo.filter(r => totalAplicado(r) === 0).length,
      cantidad: enPeriodo.length,
    };
  }, [enPeriodo]);

  // Aparte y sobre la lista entera: es lo que alimenta el aviso de la página, que tiene que
  // seguir viendo los pendientes de otros meses aunque se esté mirando uno solo.
  const sinAplicarTotal = React.useMemo(
    () => recaudos.filter(r => totalAplicado(r) === 0).length,
    [recaudos]
  );

  /**
   * Los años que existen de verdad, en vez de un rango fijo, para no ofrecer meses vacíos.
   * Se añaden siempre el año en curso —viene seleccionado por defecto y puede no tener ni un
   * recaudo— y el que esté elegido, por si al cambiar de base deja de existir: un `Select`
   * cuyo `value` no está entre sus `options` se pinta vacío y parece roto.
   */
  const opcionesAnio = React.useMemo(() => {
    const anios = new Set<string>([ANIO_ACTUAL]);
    if (anio) anios.add(anio);
    for (const r of recaudos) {
      const partes = anioMesDe(campoDePeriodo(r, basePeriodo));
      if (partes) anios.add(partes.anio);
    }
    return [...anios].sort().reverse().map(a => ({ value: a, label: a }));
  }, [recaudos, basePeriodo, anio]);

  // Segunda etapa: lo que ve la tabla.
  const filtrados = React.useMemo(() => {
    const termino = filtro.trim().toLowerCase();
    return enPeriodo.filter(r => {
      if (filtroEstado !== "todos" && estadoDe(r) !== filtroEstado) return false;
      if (!termino) return true;
      return (
        (r.apartamentos?.numero_apartamento || "").toLowerCase().includes(termino) ||
        (r.referencia_1 || "").toLowerCase().includes(termino) ||
        (r.origen || "").toLowerCase().includes(termino)
      );
    });
  }, [enPeriodo, filtro, filtroEstado]);

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

  const cambiarAnio = (valor: string) => {
    setAnio(valor);
    tabla.reiniciarPagina();
  };

  const cambiarMes = (valor: string) => {
    setMes(valor);
    tabla.reiniciarPagina();
  };

  const cambiarBasePeriodo = (valor: BasePeriodo) => {
    setBasePeriodo(valor);
    tabla.reiniciarPagina();
  };

  /** La salida del filtro por defecto: sin esto habría que adivinar qué selector tocar. */
  const limpiarPeriodo = () => {
    setAnio("");
    setMes("");
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
    sinAplicarTotal,
    filtro,
    cambiarFiltro,
    filtroEstado,
    cambiarEstado,
    anio,
    cambiarAnio,
    mes,
    cambiarMes,
    basePeriodo,
    cambiarBasePeriodo,
    opcionesAnio,
    limpiarPeriodo,
    etiquetaPeriodo: etiquetaPeriodo(anio, mes),
    hayPeriodo: Boolean(anio || mes),
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
