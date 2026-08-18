'use client';

import { useState, useEffect, useCallback } from "react";
import { listarConceptos, conceptosActivos } from "@/lib/conceptosData";
import type { Concepto } from "@/lib/conceptosData";
import { listarOpcionesApartamento, etiquetaApartamento } from "@/lib/apartamentos";
import type { ApartamentoOpcion } from "@/lib/apartamentos";
import * as api from "../api";
import {
  COBRO_VACIO, ultimoDiaDelPeriodo, avisosDelConcepto, esPeriodoPasado,
} from "../types";
import type { NuevoCobro, ResultadoCobro, CobroGenerado } from "../types";

export type PestanaCobro = "nuevo" | "generados";
export type PasoCobro = "form" | "confirmacion";

/**
 * Estado del modal de cobros extras.
 *
 * El sidebar se monta en todas las páginas de admin, así que **nada se consulta hasta que
 * el modal se abre**: si no, cada carga de página arrastraría tres consultas.
 */
export function useCrearCobro(conjuntoId: string, abierto: boolean) {
  const [pestana, setPestana] = useState<PestanaCobro>("nuevo");
  const [paso, setPaso] = useState<PasoCobro>("form");
  const [form, setForm] = useState<NuevoCobro>(COBRO_VACIO);

  const [conceptos, setConceptos] = useState<Concepto[]>([]);
  const [apartamentos, setApartamentos] = useState<ApartamentoOpcion[]>([]);
  const [generados, setGenerados] = useState<CobroGenerado[]>([]);

  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState<ResultadoCobro | null>(null);

  const recargarGenerados = useCallback(async () => {
    if (!conjuntoId) return;
    setGenerados(await api.listarCobrosGenerados(conjuntoId));
  }, [conjuntoId]);

  useEffect(() => {
    if (!abierto || !conjuntoId) return;
    let cancelado = false;

    (async () => {
      setCargando(true);
      try {
        const [listaConceptos, listaApartamentos, listaGenerados] = await Promise.all([
          listarConceptos(conjuntoId),
          listarOpcionesApartamento(conjuntoId),
          api.listarCobrosGenerados(conjuntoId),
        ]);
        if (cancelado) return;

        const activos = conceptosActivos(listaConceptos);
        setConceptos(activos);
        setApartamentos(listaApartamentos);
        setGenerados(listaGenerados);
        // El selector de apartamento usa "" para «todo el conjunto», así que el de
        // concepto no puede tener una opción vacía: arranca con el primero.
        setForm(previo => ({
          ...previo,
          concepto_codigo: previo.concepto_codigo || activos[0]?.codigo || "",
        }));
      } catch (e) {
        console.error("Error al cargar los datos del cobro:", e);
        if (!cancelado) setError("No se pudieron cargar los conceptos o los apartamentos.");
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();

    return () => { cancelado = true; };
  }, [abierto, conjuntoId]);

  const reiniciar = () => {
    setForm(COBRO_VACIO());
    setPaso("form");
    setPestana("nuevo");
    setError("");
    setResultado(null);
  };

  const cambiar = <K extends keyof NuevoCobro>(clave: K, valor: NuevoCobro[K]) => {
    setForm(previo => {
      const siguiente = { ...previo, [clave]: valor };

      // Cambiar de periodo mueve el vencimiento al último día del nuevo, que es lo que
      // hace el cron y lo que mantiene el orden en que se aplican los pagos.
      if (clave === "periodo") {
        siguiente.fecha_vencimiento = ultimoDiaDelPeriodo(String(valor));
      }

      // Al elegir concepto se propone su valor, pero solo si es de importe fijo: en los
      // de porcentaje ese campo vale 0 y precargarlo llevaría a enviar un cobro de cero.
      if (clave === "concepto_codigo") {
        const concepto = conceptos.find(c => c.codigo === valor);
        if (concepto?.tipo_calculo === "fijo" && Number(concepto.valor) > 0) {
          siguiente.valor = String(Math.round(Number(concepto.valor)));
        }
      }

      return siguiente;
    });
    setError("");
  };

  const conceptoElegido = conceptos.find(c => c.codigo === form.concepto_codigo);
  const esTodoElConjunto = form.apartamento_id === "";

  // La RPC cobra a TODOS los apartamentos del conjunto; `listarOpcionesApartamento`
  // devuelve exactamente ese conjunto (solo filtra por `conjunto_id`), así que este número
  // es el correcto. Si algún día se filtrara por `ocupado`, la confirmación mentiría.
  const cuantosApartamentos = esTodoElConjunto ? apartamentos.length : 1;
  const valorNumerico = Number(form.valor);
  const total = Number.isFinite(valorNumerico) ? valorNumerico * cuantosApartamentos : 0;

  const avisos = [
    ...avisosDelConcepto(conceptoElegido, form.periodo),
    ...(esPeriodoPasado(form.periodo)
      ? ["El cargo nace vencido y generará mora en la próxima corrida del cron."]
      : []),
  ];

  const motivoInvalido = (): string | null => {
    if (!form.concepto_codigo) return "Hay que elegir un concepto";
    if (!form.periodo) return "Hay que elegir un periodo";
    if (!form.fecha_vencimiento) return "Hay que indicar la fecha de vencimiento";
    if (!Number.isInteger(valorNumerico) || valorNumerico <= 0) {
      return "El valor debe ser un número entero mayor que cero";
    }
    if (cuantosApartamentos === 0) return "Este conjunto no tiene apartamentos";
    return null;
  };

  const continuar = () => {
    const motivo = motivoInvalido();
    if (motivo) {
      setError(motivo);
      return;
    }
    setError("");
    setPaso("confirmacion");
  };

  const enviar = async () => {
    setEnviando(true);
    setError("");
    try {
      const respuesta = await api.crearCobro(conjuntoId, form);
      setResultado(respuesta);
      // No se vuelve al formulario lleno: invitaría a reenviar creyendo que falló.
      setForm(COBRO_VACIO());
      setPaso("form");
      await recargarGenerados();
    } catch (err: any) {
      setError(err.message);
      setPaso("form");
    } finally {
      setEnviando(false);
    }
  };

  const revertir = async (cobro: CobroGenerado) => {
    setEnviando(true);
    setError("");
    try {
      const { eliminados, bloqueados } = await api.revertirCobro(
        conjuntoId, cobro.concepto_codigo, cobro.periodo
      );
      await recargarGenerados();

      if (bloqueados > 0) {
        setError(
          `Se eliminaron ${eliminados} cargos. Otros ${bloqueados} tienen pagos aplicados y no se pueden borrar sin corromper la contabilidad.`
        );
      } else {
        setResultado({ creados: 0, apartamentos: 0, omitidos: 0 });
        setError("");
      }
      return { eliminados, bloqueados };
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setEnviando(false);
    }
  };

  return {
    pestana, setPestana, paso, setPaso, form, cambiar, reiniciar,
    conceptos, apartamentos, generados, conceptoElegido,
    esTodoElConjunto, cuantosApartamentos, valorNumerico, total, avisos,
    cargando, enviando, error, setError, resultado,
    continuar, enviar, revertir,
    opcionesConcepto: conceptos.map(c => ({
      value: c.codigo,
      label: `${c.codigo} · ${c.nombre}`,
    })),
    opcionesApartamento: [
      { value: "", label: "Todo el conjunto" },
      ...apartamentos.map(a => ({ value: a.id, label: etiquetaApartamento(a) })),
    ],
  };
}

export type EstadoCrearCobro = ReturnType<typeof useCrearCobro>;
