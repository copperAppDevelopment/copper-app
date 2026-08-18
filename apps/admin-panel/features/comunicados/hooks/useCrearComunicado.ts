'use client';

import { useState, useEffect, useCallback } from "react";
import { listarOpcionesApartamento, etiquetaApartamento, type ApartamentoOpcion } from "@/lib/apartamentos";
import * as api from "../api";
import { MAX_BYTES_ADJUNTO, MIMES_PERMITIDOS } from "../types";
import type { NuevoComunicado, TipoComunicado } from "../types";

const FORMULARIO_VACIO: NuevoComunicado = {
  tipo: "Comunicado",
  tipo_novedad: "Novedad",
  titulo: "",
  descripcion: "",
  apartamento_id: "",
};

/**
 * Estado y envío del formulario de comunicados. El modal no hace I/O: solo pinta
 * lo que este hook expone.
 */
export function useCrearComunicado(conjuntoId: string, abierto: boolean) {
  const [form, setForm] = useState<NuevoComunicado>(FORMULARIO_VACIO);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [apartamentos, setApartamentos] = useState<ApartamentoOpcion[]>([]);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [loading, setLoading] = useState(false);
  /**
   * Cambia cada vez que el formulario se vacía. El modal la usa como `key` del
   * `<input type="file">`: un input de archivo no se puede limpiar por estado, hay que
   * remontarlo, o seguiría mostrando el nombre del archivo ya publicado.
   */
  const [version, setVersion] = useState(0);

  // Los apartamentos solo hacen falta para los reportes, y solo con el modal abierto.
  useEffect(() => {
    if (!abierto || !conjuntoId || apartamentos.length > 0) return;
    listarOpcionesApartamento(conjuntoId).then(setApartamentos).catch(() => {
      setError("No se pudieron cargar los apartamentos.");
    });
  }, [abierto, conjuntoId, apartamentos.length]);

  const cambiar = useCallback(
    <K extends keyof NuevoComunicado>(campo: K, valor: NuevoComunicado[K]) => {
      setForm(previo => ({ ...previo, [campo]: valor }));
      setExito("");
    },
    []
  );

  const cambiarTipo = useCallback((tipo: TipoComunicado) => {
    // Un comunicado va siempre a todo el conjunto: el apartamento elegido deja de aplicar.
    setForm(previo => ({
      ...previo,
      tipo,
      apartamento_id: tipo === "Comunicado" ? "" : previo.apartamento_id,
    }));
    setExito("");
  }, []);

  const elegirArchivo = useCallback((elegido: File | null) => {
    setExito("");

    if (!elegido) {
      setArchivo(null);
      setError("");
      return;
    }

    if (elegido.size > MAX_BYTES_ADJUNTO) {
      setArchivo(null);
      setError("El archivo supera el límite de 10 MB.");
      return;
    }

    if (!MIMES_PERMITIDOS.includes(elegido.type)) {
      setArchivo(null);
      setError("Solo se admiten imágenes (JPG, PNG, WEBP) o PDF.");
      return;
    }

    setArchivo(elegido);
    setError("");
  }, []);

  const reiniciar = useCallback(() => {
    setForm(FORMULARIO_VACIO);
    setArchivo(null);
    setError("");
    setExito("");
    setVersion(v => v + 1);
  }, []);

  const enviar = useCallback(async () => {
    if (!form.titulo.trim() || !form.descripcion.trim()) {
      setError("El título y la descripción son obligatorios.");
      return;
    }

    setLoading(true);
    setError("");
    setExito("");

    try {
      await api.crearComunicado(conjuntoId, form, archivo);
      setForm(FORMULARIO_VACIO);
      setArchivo(null);
      setVersion(v => v + 1);
      setExito(
        form.tipo === "Comunicado"
          ? "Comunicado publicado. Se notificó a los residentes del conjunto."
          : form.apartamento_id
            ? "Reporte publicado. Se notificó a los residentes del apartamento."
            : "Reporte publicado. Se notificó a los residentes del conjunto."
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [conjuntoId, form, archivo]);

  const opcionesApartamento = [
    { value: "", label: "Todo el conjunto" },
    ...apartamentos.map(a => ({ value: a.id, label: etiquetaApartamento(a) })),
  ];

  return {
    form,
    archivo,
    version,
    error,
    exito,
    loading,
    opcionesApartamento,
    cambiar,
    cambiarTipo,
    elegirArchivo,
    reiniciar,
    enviar,
  };
}

export type EstadoCrearComunicado = ReturnType<typeof useCrearComunicado>;
