'use client';

import { useState, useEffect, useCallback } from "react";

export interface InvitacionVisible {
  rol: string;
  email: string;
  nombres: string | null;
  apellidos: string | null;
  tipo_documento: string | null;
  numero_documento: string | null;
  telefono: string | null;
  nombre_conjunto: string;
}

export interface FormularioInvitacion {
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  numero_documento: string;
  telefono: string;
  password: string;
  repetida: string;
}

const VACIO: FormularioInvitacion = {
  nombres: "", apellidos: "", tipo_documento: "CC",
  numero_documento: "", telefono: "", password: "", repetida: "",
};

const MINIMO = 8;

/** Carga y aceptación de una invitación. La página no habla con la red directamente. */
export function useAceptarInvitacion(token: string) {
  const [invitacion, setInvitacion] = useState<InvitacionVisible | null>(null);
  const [form, setForm] = useState<FormularioInvitacion>(VACIO);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [listo, setListo] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("El enlace no incluye ningún token de invitación.");
      setLoading(false);
      return;
    }

    let cancelado = false;

    (async () => {
      try {
        const res = await fetch(`/api/v1/invitaciones/validar?token=${encodeURIComponent(token)}`);
        const json = await res.json();
        if (cancelado) return;

        if (!res.ok) {
          setError(json.error || "No se pudo validar la invitación.");
          return;
        }

        const datos = json.data as InvitacionVisible;
        setInvitacion(datos);
        // Lo que la invitación ya traía se rellena y se muestra bloqueado.
        setForm(previo => ({
          ...previo,
          nombres: datos.nombres ?? "",
          apellidos: datos.apellidos ?? "",
          tipo_documento: datos.tipo_documento ?? "CC",
          numero_documento: datos.numero_documento ?? "",
          telefono: datos.telefono ?? "",
        }));
      } catch {
        if (!cancelado) setError("No se pudo validar la invitación.");
      } finally {
        if (!cancelado) setLoading(false);
      }
    })();

    return () => { cancelado = true; };
  }, [token]);

  const cambiar = useCallback(
    <K extends keyof FormularioInvitacion>(campo: K, valor: FormularioInvitacion[K]) => {
      setForm(previo => ({ ...previo, [campo]: valor }));
    },
    []
  );

  const aceptar = useCallback(async () => {
    if (form.password.length < MINIMO) {
      setError(`La contraseña debe tener al menos ${MINIMO} caracteres.`);
      return;
    }

    if (form.password !== form.repetida) {
      setError("Las dos contraseñas no coinciden.");
      return;
    }

    setEnviando(true);
    setError("");
    try {
      const res = await fetch("/api/v1/invitaciones/aceptar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, ...form }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "No se pudo completar el registro.");
        return;
      }

      setListo(true);
    } catch {
      setError("No se pudo completar el registro.");
    } finally {
      setEnviando(false);
    }
  }, [token, form]);

  return { invitacion, form, loading, enviando, error, listo, cambiar, aceptar };
}
