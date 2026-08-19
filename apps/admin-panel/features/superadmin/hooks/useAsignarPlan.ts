'use client';

import { useState, useEffect } from "react";
import { precioDelPlan, normalizarPeriodo } from "@/lib/conjuntos";
import type { TipoPeriodo, Plan } from "@/lib/conjuntos";
import * as api from "../api";
import type { FilaAsignacion, AdminDelConjunto } from "../types";

export type PasoAsignacion = "form" | "confirmacion";
export type InicioVigencia = "hoy" | "vencimiento";

/**
 * Estado del modal de asignación de plan.
 *
 * Nada se consulta hasta que el modal se abre, y siempre para un conjunto concreto: los
 * administradores dependen de él.
 */
export function useAsignarPlan(fila: FilaAsignacion | null, abierto: boolean) {
  const [paso, setPaso] = useState<PasoAsignacion>("form");
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [admins, setAdmins] = useState<AdminDelConjunto[]>([]);

  const [planId, setPlanId] = useState("");
  const [periodo, setPeriodo] = useState<TipoPeriodo>("mensual");
  const [adminUserId, setAdminUserId] = useState("");
  const [precio, setPrecio] = useState("0");
  const [desde, setDesde] = useState<InicioVigencia>("hoy");

  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!abierto || !fila) return;
    let cancelado = false;

    (async () => {
      setCargando(true);
      setError("");
      setPaso("form");
      // Cortesía por defecto: quien quiera registrar un cobro real lo escribe.
      setPrecio("0");
      setDesde("hoy");
      try {
        const [listaPlanes, listaAdmins] = await Promise.all([
          api.listarPlanesActivos(),
          api.listarAdminsDeConjunto(fila.conjunto_id),
        ]);
        if (cancelado) return;

        setPlanes(listaPlanes);
        setAdmins(listaAdmins);
        setPlanId(fila.plan_id ?? listaPlanes[0]?.id ?? "");
        setPeriodo(normalizarPeriodo(fila.tipo_periodo) ?? "mensual");
        // El propietario viene primero en la lista; si la suscripción ya estaba a nombre de
        // otro administrador, se respeta.
        const previo = listaAdmins.find(a => a.user_id === fila.admin_user_id);
        setAdminUserId(previo?.user_id ?? listaAdmins[0]?.user_id ?? "");
      } catch (e) {
        console.error("Error al preparar la asignación:", e);
        if (!cancelado) setError("No se pudieron cargar los planes o los administradores.");
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();

    return () => { cancelado = true; };
  }, [abierto, fila]);

  const planElegido = planes.find(p => p.id === planId) ?? null;
  const precioNumerico = Number(precio);
  const precioLista = planElegido ? precioDelPlan(planElegido, periodo) : 0;

  /** Queda vigencia por delante, así que se puede encadenar en vez de empezar de cero. */
  const tieneVigencia = Boolean(fila?.fecha_fin && new Date(fila.fecha_fin) > new Date());

  const motivoInvalido = (): string | null => {
    if (!admins.length) {
      return "Este conjunto no tiene ningún administrador activo, y la suscripción tiene que quedar a nombre de uno. Asígnale primero un administrador.";
    }
    if (!planId) return "Hay que elegir un plan";
    if (!adminUserId) return "Hay que elegir el administrador";
    if (!Number.isFinite(precioNumerico) || precioNumerico < 0) {
      return "El precio tiene que ser un número mayor o igual que cero";
    }
    return null;
  };

  const avisos = [
    ...(precioNumerico === 0
      ? ["Al quedar en cero, no sumará a los ingresos por suscripción del dashboard."]
      : ["Este valor sumará a los ingresos por suscripción del mes en el dashboard."]),
    ...(fila?.suscripcion_id
      ? ["Se actualizará la suscripción vigente del conjunto; no se crea una fila nueva."]
      : []),
    ...(desde === "hoy" && tieneVigencia
      ? ["La vigencia arranca hoy: se pierden los días que le quedaban a la anterior."]
      : []),
  ];

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
    if (!fila) return null;
    setEnviando(true);
    setError("");
    try {
      const respuesta = await api.asignarPlan({
        conjunto_id: fila.conjunto_id,
        plan_id: planId,
        tipo_periodo: periodo,
        admin_user_id: adminUserId,
        precio_pagado: precioNumerico,
        desde,
      });
      return respuesta;
    } catch (err: any) {
      setError(err.message);
      setPaso("form");
      return null;
    } finally {
      setEnviando(false);
    }
  };

  return {
    paso, setPaso, planes, admins, planElegido,
    planId, setPlanId, periodo, setPeriodo, adminUserId, setAdminUserId,
    precio, setPrecio, precioLista, precioNumerico, desde, setDesde, tieneVigencia,
    cargando, enviando, error, setError, avisos, motivoInvalido, continuar, enviar,
    opcionesAdmin: admins.map(a => ({
      value: a.user_id,
      label: `${a.nombre_completo || a.email || "Sin nombre"}${a.es_propietario ? " (propietario)" : ""}`,
    })),
  };
}

export type EstadoAsignarPlan = ReturnType<typeof useAsignarPlan>;
