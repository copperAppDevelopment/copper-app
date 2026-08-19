'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import { MAX_PLANES_ACTIVOS } from "@/lib/planesData";
import type { PlanCompleto } from "@/lib/planesData";
import * as api from "../api";
import type { DatosPlan } from "../api";

/** Lista de planes comerciales, con sus contadores y las dos escrituras. */
export function usePlanes(sesionCargando: boolean) {
  const [planes, setPlanes] = useState<PlanCompleto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  const recargar = useCallback(async () => {
    try {
      setPlanes(await api.listarTodosLosPlanes());
      setError("");
    } catch (e: any) {
      console.error("Error al cargar los planes:", e);
      setError("No se pudieron cargar los planes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sesionCargando) return;
    recargar();
  }, [sesionCargando, recargar]);

  const contadores = useMemo(() => {
    const activos = planes.filter(p => p.activo).length;
    return { total: planes.length, activos, inactivos: planes.length - activos };
  }, [planes]);

  /** Con el cupo lleno, un plan nuevo nacería inactivo y no se puede encender ninguno más. */
  const cupoLleno = contadores.activos >= MAX_PLANES_ACTIVOS;

  const guardar = async (datos: DatosPlan, planId?: string) => {
    // Sin try/catch: lo captura el modal, que es quien pinta el error del formulario.
    const respuesta = await api.guardarPlan(datos, planId);
    await recargar();
    setAviso(
      respuesta.creado
        ? `Se creó el plan ${datos.nombre}${cupoLleno ? ", inactivo porque ya hay tres activos." : "."}`
        : `Se guardaron los cambios del plan ${datos.nombre}.`
    );
  };

  const alternarActivo = async (plan: PlanCompleto) => {
    setError("");
    setAviso("");
    try {
      await api.cambiarActivoPlan(plan.id, !plan.activo);
      await recargar();
      setAviso(`El plan ${plan.nombre} quedó ${plan.activo ? "inactivo" : "activo"}.`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    planes, loading, error, setError, aviso, setAviso,
    contadores, cupoLleno, recargar, guardar, alternarActivo,
  };
}

export type EstadoPlanes = ReturnType<typeof usePlanes>;
