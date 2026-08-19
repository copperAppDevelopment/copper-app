'use client';

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTablaLocal } from "@/hooks/useTablaLocal";
import { listarOpcionesApartamento, etiquetaApartamento } from "@/lib/apartamentos";
import type { ApartamentoOpcion } from "@/lib/apartamentos";
import type { EstadoVisita } from "@/lib/recepcion";
import * as api from "../api";
import { desdeISO } from "../types";
import type {
  VisitaRecepcion, EnvioRecepcion, NuevaVisita, NuevoEnvio, Pestana,
} from "../types";

/**
 * Visitas y envíos del conjunto.
 *
 * El rango de fechas se aplica **en la consulta**: `useTablaLocal` ordena y pagina en
 * memoria sobre lo que se le dé, y un conjunto de 200 apartamentos genera miles de visitas
 * al año. Traerlas todas para paginarlas después no escalaría.
 */
export function useRecepcion(conjuntoId: string, rangoInicial: string) {
  const [pestana, setPestana] = useState<Pestana>("visitas");
  const [rango, setRango] = useState(rangoInicial);
  const [filtro, setFiltro] = useState("");

  const [visitas, setVisitas] = useState<VisitaRecepcion[]>([]);
  const [envios, setEnvios] = useState<EnvioRecepcion[]>([]);
  const [apartamentos, setApartamentos] = useState<ApartamentoOpcion[]>([]);

  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const recargar = useCallback(async () => {
    if (!conjuntoId) return;
    try {
      const desde = desdeISO(rango);
      const [v, e] = await Promise.all([
        api.listarVisitas(conjuntoId, desde),
        api.listarEnvios(conjuntoId, desde),
      ]);
      setVisitas(v);
      setEnvios(e);
      setError("");
    } catch (err) {
      console.error("Error al cargar recepción:", err);
      setError("No se pudieron cargar las visitas y los envíos.");
    } finally {
      setLoading(false);
    }
  }, [conjuntoId, rango]);

  useEffect(() => { recargar(); }, [recargar]);

  useEffect(() => {
    if (!conjuntoId) return;
    listarOpcionesApartamento(conjuntoId).then(setApartamentos).catch(() => {
      setError("No se pudo cargar la lista de apartamentos.");
    });
  }, [conjuntoId]);

  const visitasFiltradas = useMemo(() => {
    const termino = filtro.trim().toLowerCase();
    if (!termino) return visitas;
    return visitas.filter(v =>
      (v.nombres || "").toLowerCase().includes(termino) ||
      (v.label_apartamento || "").toLowerCase().includes(termino) ||
      (v.motivo || "").toLowerCase().includes(termino)
    );
  }, [visitas, filtro]);

  const enviosFiltrados = useMemo(() => {
    const termino = filtro.trim().toLowerCase();
    if (!termino) return envios;
    return envios.filter(e =>
      (e.empresa_mensajeria || "").toLowerCase().includes(termino) ||
      (e.label_apartamento || "").toLowerCase().includes(termino)
    );
  }, [envios, filtro]);

  const tablaVisitas = useTablaLocal(visitasFiltradas, {
    pageSize: 15, sortInicial: "fecha", ordenInicial: "desc",
  });
  const tablaEnvios = useTablaLocal(enviosFiltrados, {
    pageSize: 15, sortInicial: "fecha", ordenInicial: "desc",
  });

  const indicadores = useMemo(() => ({
    visitasPendientes: visitas.filter(v => v.estado_autorizacion === "pendiente").length,
    visitasAprobadas: visitas.filter(v => v.estado_autorizacion === "aprobado").length,
    enviosPendientes: envios.filter(e => e.estado === "pendiente").length,
  }), [visitas, envios]);

  const cambiarFiltro = (valor: string) => {
    setFiltro(valor);
    tablaVisitas.reiniciarPagina();
    tablaEnvios.reiniciarPagina();
  };

  /** Envuelve una mutación: limpia mensajes, recarga y traduce el error. */
  const ejecutar = async (accion: () => Promise<unknown>, mensaje: string) => {
    setEnviando(true);
    setError("");
    setExito("");
    try {
      await accion();
      await recargar();
      setExito(mensaje);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setEnviando(false);
    }
  };

  return {
    pestana, setPestana, rango, setRango, filtro, cambiarFiltro,
    visitas, envios, apartamentos, indicadores,
    tablaVisitas, tablaEnvios,
    loading, enviando, error, setError, exito, recargar,

    registrarVisita: (payload: NuevaVisita) =>
      ejecutar(() => api.registrarVisita(conjuntoId, payload),
        "Visita registrada. Se notificó a los residentes del apartamento."),

    responderVisita: (visitaId: string, estado: EstadoVisita) =>
      ejecutar(() => api.responderVisita(conjuntoId, visitaId, estado),
        estado === "aprobado" ? "Visita aprobada." : "Visita rechazada."),

    registrarEnvio: (payload: NuevoEnvio) =>
      ejecutar(() => api.registrarEnvio(conjuntoId, payload),
        "Envío registrado. Se notificó a los residentes del apartamento."),

    entregarEnvio: (envioId: string, recibidoPor: string) =>
      ejecutar(() => api.entregarEnvio(conjuntoId, envioId, recibidoPor),
        "Envío marcado como entregado."),

    opcionesApartamento: apartamentos.map(a => ({
      value: a.id,
      label: etiquetaApartamento(a),
    })),
  };
}

export type EstadoRecepcion = ReturnType<typeof useRecepcion>;
