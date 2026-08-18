'use client';

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import * as api from "../api";
import type { Perfil, DatosPerfil } from "../types";

const VACIO: DatosPerfil = {
  nombres: "",
  apellidos: "",
  tipo_documento: "CC",
  documento: "",
  phone_number: "",
  direccion: "",
};

export function usePerfil() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [form, setForm] = useState<DatosPerfil>(VACIO);
  const [foto, setFoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const cargar = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const datos = await api.obtenerPerfil(session.user.id);
      if (!datos) {
        setError("No se encontró tu perfil.");
        return;
      }

      setPerfil(datos);
      setForm({
        nombres: datos.nombres ?? "",
        apellidos: datos.apellidos ?? "",
        tipo_documento: datos.tipo_documento ?? "CC",
        documento: datos.documento ?? "",
        phone_number: datos.phone_number ?? "",
        direccion: datos.direccion ?? "",
      });
      setError("");
    } catch (e) {
      console.error("Error al cargar el perfil:", e);
      setError("No se pudo cargar tu perfil.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const cambiar = useCallback(<K extends keyof DatosPerfil>(campo: K, valor: DatosPerfil[K]) => {
    setForm(previo => ({ ...previo, [campo]: valor }));
    setExito("");
  }, []);

  const guardar = useCallback(async () => {
    if (!form.nombres.trim() || !form.apellidos.trim() || !form.documento.trim()) {
      setError("Nombres, apellidos y documento son obligatorios.");
      return;
    }

    setGuardando(true);
    setError("");
    setExito("");
    try {
      await api.guardarPerfil(form, foto);
      setFoto(null);
      await cargar();
      setExito("Perfil actualizado.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }, [form, foto, cargar]);

  return {
    perfil, form, foto, loading, guardando, error, exito,
    setFoto, setError, cambiar, guardar, recargar: cargar,
  };
}
