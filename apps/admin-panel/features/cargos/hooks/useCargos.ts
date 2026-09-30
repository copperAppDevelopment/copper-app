'use client';

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useTablaLocal } from "@/hooks/useTablaLocal";
import { periodoActual } from "@/lib/conceptos";
import * as api from "../api";
import { etiquetaApartamento, opcionesPeriodo, TODOS_LOS_CONDONADOS } from "../types";
import type { Cargo, FiltroEstado } from "../types";

const PAGE_SIZE = 15;
const PERIODOS = opcionesPeriodo();

export function useCargos(conjuntoId: string, sesionCargando: boolean) {
  const [loading, setLoading] = useState(true);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [error, setError] = useState("");
  const [operandoId, setOperandoId] = useState<string | null>(null);

  // La página abre por el mes en curso, igual que Recaudos.
  const [periodo, setPeriodo] = useState(periodoActual());
  const [filtro, setFiltro] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("todos");
  const [filtroConcepto, setFiltroConcepto] = useState("");

  const recargar = useCallback(async () => {
    if (!conjuntoId) return;
    try {
      setCargos(await api.listarCargos(conjuntoId, periodo));
      setError("");
    } catch (e) {
      console.error("Error al cargar los cargos:", e);
      setError("No se pudieron cargar los cargos.");
    }
  }, [conjuntoId, periodo]);

  useEffect(() => {
    if (sesionCargando || !conjuntoId) return;
    (async () => {
      await recargar();
      setLoading(false);
    })();
  }, [sesionCargando, conjuntoId, recargar]);

  // Las cifras son de todo lo consultado y no responden a la búsqueda: los totales del mes se
  // quedan quietos mientras se busca un apartamento dentro de él.
  const indicadores = React.useMemo(() => {
    const suma = (campo: keyof Cargo) =>
      cargos.reduce((total, c) => total + Number(c[campo] ?? 0), 0);
    return {
      facturado: suma("valor_final"),
      recaudado: suma("pagado"),
      condonado: suma("valor_condonado"),
      // Solo lo que se debe: un cargo negativo es un saldo a favor, no resta de la cartera.
      pendiente: cargos.reduce((total, c) => total + Math.max(Number(c.saldo ?? 0), 0), 0),
      cantidad: cargos.length,
      condonados: cargos.filter(c => c.estado === "condonado").length,
    };
  }, [cargos]);

  /** Los conceptos que de verdad aparecen en lo consultado, no todo el catálogo. */
  const opcionesConcepto = React.useMemo(() => {
    const vistos = new Map<string, string>();
    for (const c of cargos) vistos.set(c.concepto_codigo, c.concepto_nombre);
    return [...vistos.entries()]
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([codigo, nombre]) => ({ value: codigo, label: nombre }));
  }, [cargos]);

  const filtrados = React.useMemo(() => {
    const termino = filtro.trim().toLowerCase();
    return cargos.filter(c => {
      if (filtroEstado !== "todos" && c.estado !== filtroEstado) return false;
      if (filtroConcepto && c.concepto_codigo !== filtroConcepto) return false;
      if (!termino) return true;
      return etiquetaApartamento(c).toLowerCase().includes(termino);
    });
  }, [cargos, filtro, filtroEstado, filtroConcepto]);

  const tabla = useTablaLocal(filtrados, { pageSize: PAGE_SIZE });

  const cambiarPeriodo = (valor: string) => {
    setPeriodo(valor);
    // El concepto elegido puede no existir en el otro periodo, y un `Select` cuyo valor no
    // está entre sus opciones se pinta vacío y parece roto.
    setFiltroConcepto("");
    tabla.reiniciarPagina();
  };

  const cambiarFiltro = (valor: string) => { setFiltro(valor); tabla.reiniciarPagina(); };
  const cambiarEstado = (valor: FiltroEstado) => { setFiltroEstado(valor); tabla.reiniciarPagina(); };
  const cambiarConcepto = (valor: string) => { setFiltroConcepto(valor); tabla.reiniciarPagina(); };

  /** Lanza el error: el modal lo muestra junto al formulario en vez de cerrarse. */
  const condonar = async (cargoId: string, motivo: string) => {
    setOperandoId(cargoId);
    try {
      await api.condonarCargo(conjuntoId, cargoId, motivo);
      await recargar();
    } finally {
      setOperandoId(null);
    }
  };

  const reactivar = async (cargoId: string) => {
    setOperandoId(cargoId);
    setError("");
    try {
      await api.reactivarCargo(conjuntoId, cargoId);
      await recargar();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setOperandoId(null);
    }
  };

  return {
    loading,
    error,
    indicadores,
    periodo,
    cambiarPeriodo,
    opcionesPeriodo: PERIODOS,
    etiquetaPeriodo: PERIODOS.find(p => p.value === periodo)?.label ?? periodo,
    soloCondonados: periodo === TODOS_LOS_CONDONADOS,
    filtro,
    cambiarFiltro,
    filtroEstado,
    cambiarEstado,
    filtroConcepto,
    cambiarConcepto,
    opcionesConcepto,
    tabla,
    operandoId,
    recargar,
    condonar,
    reactivar,
  };
}
