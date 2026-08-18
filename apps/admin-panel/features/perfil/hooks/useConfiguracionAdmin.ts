'use client';

import { useState, useEffect, useCallback } from "react";
import * as api from "../adminApi";
import type {
  Concepto, DatosConcepto, ConfiguracionConjunto, DatosConfiguracion,
} from "../adminTypes";
import type { TipoProntoPago } from "@/lib/conceptos";

const CONFIG_VACIA: DatosConfiguracion = {
  link_pago: "",
  pronto_pago_habilitado: false,
  pronto_pago_tipo: "porcentaje",
  pronto_pago_valor: "",
  pronto_pago_porcentaje: "",
  pronto_pago_dias: "",
};

/** La base guarda el porcentaje como fracción (0.02) y la UI lo muestra como 2. */
const aPorcentajeUi = (valor: number | null) =>
  valor === null || valor === undefined ? "" : String(Number(valor) * 100);

export function useConfiguracionAdmin(conjuntoId: string) {
  const [conceptos, setConceptos] = useState<Concepto[]>([]);
  const [config, setConfig] = useState<ConfiguracionConjunto | null>(null);
  const [form, setForm] = useState<DatosConfiguracion>(CONFIG_VACIA);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const recargar = useCallback(async (id: string) => {
    try {
      const [lista, cfg] = await Promise.all([
        api.listarConceptos(id),
        api.obtenerConfiguracion(id),
      ]);

      setConceptos(lista);
      setConfig(cfg);
      setForm({
        link_pago: cfg?.link_pago ?? "",
        pronto_pago_habilitado: cfg?.pronto_pago_habilitado ?? false,
        pronto_pago_tipo: (cfg?.pronto_pago_tipo as TipoProntoPago) ?? "porcentaje",
        pronto_pago_valor: cfg?.pronto_pago_valor != null ? String(cfg.pronto_pago_valor) : "",
        // El pronto pago sí se guarda como número entero de porcentaje, no como fracción.
        pronto_pago_porcentaje:
          cfg?.pronto_pago_porcentaje != null ? String(cfg.pronto_pago_porcentaje) : "",
        pronto_pago_dias: cfg?.pronto_pago_dias != null ? String(cfg.pronto_pago_dias) : "",
      });
      setError("");
    } catch (e) {
      console.error("Error al cargar la configuración:", e);
      setError("No se pudo cargar la configuración del conjunto.");
    }
  }, []);

  useEffect(() => {
    if (!conjuntoId) return;
    (async () => {
      await recargar(conjuntoId);
      setLoading(false);
    })();
  }, [conjuntoId, recargar]);

  const cambiar = useCallback(
    <K extends keyof DatosConfiguracion>(campo: K, valor: DatosConfiguracion[K]) => {
      setForm(previo => ({ ...previo, [campo]: valor }));
      setExito("");
    },
    []
  );

  const guardarConfig = async () => {
    setGuardando(true);
    setError("");
    setExito("");
    try {
      await api.guardarConfiguracion(conjuntoId, form);
      await recargar(conjuntoId);
      setExito("Configuración guardada.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const guardarConcepto = async (datos: DatosConcepto, conceptoId?: string) => {
    await api.guardarConcepto(conjuntoId, datos, conceptoId);
    await recargar(conjuntoId);
  };

  const alternarConcepto = async (concepto: Concepto) => {
    setError("");
    try {
      await api.cambiarActivoConcepto(conjuntoId, concepto.id, !concepto.activo);
      await recargar(conjuntoId);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    conceptos, config, form, loading, guardando, error, exito,
    setError, cambiar, guardarConfig, guardarConcepto, alternarConcepto,
    aPorcentajeUi,
  };
}
