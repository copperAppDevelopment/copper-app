'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import { useTablaLocal } from "@/hooks/useTablaLocal";
import { ESTADOS_CONTACTO } from "@/lib/contactos";
import type { EstadoContacto } from "@/lib/contactos";
import * as api from "../api";
import type { Contacto } from "../types";

const PAGE_SIZE = 10;

/** Las solicitudes de la página web, con búsqueda, filtros y contadores. */
export function useContactos(sesionCargando: boolean) {
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("");
  const [tipo, setTipo] = useState("");

  const recargar = useCallback(async () => {
    try {
      setContactos(await api.listarContactos());
      setError("");
    } catch (e: any) {
      console.error("Error al cargar los contactos:", e);
      setError(e.message || "No se pudieron cargar los contactos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sesionCargando) return;
    recargar();
  }, [sesionCargando, recargar]);

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return contactos.filter(c => {
      if (estado && c.estado !== estado) return false;
      if (tipo && c.tipo_solicitud !== tipo) return false;
      if (!texto) return true;
      return [c.nombre, c.apellido, c.email, c.telefono, c.nombre_conjunto]
        .some(v => (v ?? "").toLowerCase().includes(texto));
    });
  }, [contactos, busqueda, estado, tipo]);

  const tabla = useTablaLocal(filtrados, {
    pageSize: PAGE_SIZE,
    sortInicial: "created_at",
    ordenInicial: "desc",
  });

  const contadores = useMemo(() => ({
    total: contactos.length,
    Pendiente: contactos.filter(c => c.estado === "Pendiente").length,
    Atendida: contactos.filter(c => c.estado === "Atendida").length,
    Rechazada: contactos.filter(c => c.estado === "Rechazada").length,
  }), [contactos]);

  /**
   * Las opciones del filtro salen de los datos y no de una lista fija: el formulario de la
   * landing ofrece «Alianzas comerciales» y «Adquirir plan», pero en la base hay guardado
   * «Adquirir Plan» con P mayúscula. Así un tipo nuevo aparece solo.
   */
  const opcionesTipo = useMemo(() => {
    const tipos = Array.from(new Set(contactos.map(c => c.tipo_solicitud).filter(Boolean)));
    tipos.sort((a, b) => a.localeCompare(b, "es"));
    return [{ value: "", label: "Todos los tipos" }, ...tipos.map(t => ({ value: t, label: t }))];
  }, [contactos]);

  const opcionesEstado = [
    { value: "", label: "Todos los estados" },
    ...ESTADOS_CONTACTO.map(e => ({ value: e, label: e })),
  ];

  const ejecutar = async (accion: () => Promise<unknown>, mensaje: string) => {
    setError("");
    setAviso("");
    try {
      await accion();
      await recargar();
      setAviso(mensaje);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const marcar = (contacto: Contacto, nuevo: EstadoContacto) =>
    ejecutar(
      () => api.marcarContacto(contacto.id, nuevo),
      `La solicitud de ${contacto.nombre} quedó como ${nuevo.toLowerCase()}.`
    );

  const borrar = (contacto: Contacto) =>
    ejecutar(
      () => api.borrarContacto(contacto.id),
      `Se borró la solicitud de ${contacto.nombre}.`
    );

  return {
    contactos: filtrados, loading, error, setError, aviso, setAviso,
    busqueda, setBusqueda, estado, setEstado, tipo, setTipo,
    opcionesEstado, opcionesTipo, tabla, contadores, recargar, marcar, borrar,
  };
}

export type EstadoContactos = ReturnType<typeof useContactos>;
