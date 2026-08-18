'use client';

import { useState, useEffect, useCallback } from "react";
import type { EstadoSolicitud, PrioridadSolicitud } from "@/lib/solicitudes";
import type { Solicitud, GestionSolicitud, ResultadoGestion } from "../types";

/** Un `timestamptz` partido en los dos inputs del formulario. */
function partirFecha(valor: string | null): { dia: string; hora: string } {
  if (!valor) return { dia: "", hora: "" };
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return { dia: "", hora: "" };
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    dia: `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}`,
    hora: `${pad(fecha.getHours())}:${pad(fecha.getMinutes())}`,
  };
}

interface Formulario {
  estado: EstadoSolicitud;
  prioridad: PrioridadSolicitud | "";
  adminId: string;
  comentario: string;
  /** "" = sin responder, "si" / "no" = respondido. */
  viable: "" | "si" | "no";
  dia: string;
  hora: string;
  costo: string;
}

/**
 * Estado del formulario de gestión. El modal no hace I/O ni compone fechas: solo pinta.
 */
export function useGestionSolicitud(
  solicitud: Solicitud | null,
  gestionar: (payload: GestionSolicitud) => Promise<ResultadoGestion>
) {
  const [form, setForm] = useState<Formulario | null>(null);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [loading, setLoading] = useState(false);

  // Al abrir con otra solicitud, el formulario parte de lo que ya tiene guardado.
  useEffect(() => {
    if (!solicitud) {
      setForm(null);
      return;
    }
    const programada = partirFecha(solicitud.fecha_programada);
    const hora = partirFecha(solicitud.hora).hora;
    setForm({
      estado: (solicitud.estado_solicitud as EstadoSolicitud) ?? "pendientes",
      prioridad: (solicitud.prioridad as PrioridadSolicitud) ?? "",
      adminId: solicitud.admin_conjunto_id ?? "",
      comentario: solicitud.comentario_administrador ?? "",
      viable: solicitud.fecha_atencion_viable === null ? "" :
        solicitud.fecha_atencion_viable ? "si" : "no",
      dia: programada.dia,
      hora: hora || programada.hora,
      costo: solicitud.costo ? String(solicitud.costo) : "",
    });
    setError("");
    setExito("");
  }, [solicitud]);

  const cambiar = useCallback(<K extends keyof Formulario>(campo: K, valor: Formulario[K]) => {
    setForm(previo => (previo ? { ...previo, [campo]: valor } : previo));
    setExito("");
  }, []);

  const guardar = useCallback(async () => {
    if (!solicitud || !form) return;

    const valorCosto = form.costo.trim() ? Number(form.costo) : 0;
    if (form.costo.trim() && (!Number.isFinite(valorCosto) || valorCosto < 0)) {
      setError("El costo debe ser un número mayor o igual que cero.");
      return;
    }

    setLoading(true);
    setError("");
    setExito("");

    // El día y la hora son dos inputs pero una sola marca de tiempo en la base.
    const marca = form.dia ? new Date(`${form.dia}T${form.hora || "00:00"}`).toISOString() : null;

    try {
      const resultado = await gestionar({
        solicitud_id: solicitud.id_solicitud,
        solicitud_estado: form.estado,
        solicitud_prioridad: form.prioridad || null,
        asignado_admin_conjunto_id: form.adminId || null,
        admin_comentario: form.comentario,
        fecha_atencion_viable: form.viable === "" ? null : form.viable === "si",
        fecha_atencion_solicitud: marca,
        hora_atencion: form.dia && form.hora ? marca : null,
        // Solo se manda si cambió: reenviar el mismo costo no debe reintentar el cobro.
        costo: valorCosto > 0 && valorCosto !== solicitud.costo ? valorCosto : null,
      });

      setExito(
        resultado.cobro
          ? resultado.cobro.creado
            ? "Cambios guardados y cobro generado al residente."
            : "Cambios guardados. Esta solicitud ya tenía un cobro generado."
          : "Cambios guardados."
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [solicitud, form, gestionar]);

  return { form, error, exito, loading, cambiar, guardar };
}
