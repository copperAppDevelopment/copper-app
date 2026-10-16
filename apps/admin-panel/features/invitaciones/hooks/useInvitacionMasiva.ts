'use client';

import { useState } from "react";
import * as api from "../api";
import type { LineaMasiva } from "../types";

type Paso = "escribir" | "revisar" | "listo";

/**
 * Los tres pasos de «Invitar varios»: pegar la lista, revisar qué se hará con cada línea y ver
 * el resultado. La vista previa no escribe nada; el envío vuelve a clasificar en el servidor.
 */
export function useInvitacionMasiva(conjuntoId: string, alTerminar: () => void) {
  const [paso, setPaso] = useState<Paso>("escribir");
  const [texto, setTexto] = useState("");
  const [lineas, setLineas] = useState<LineaMasiva[]>([]);
  const [resultado, setResultado] = useState<{ enviadas: number; fallidas: { email: string; error: string }[] } | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const reiniciar = () => {
    setPaso("escribir");
    setTexto("");
    setLineas([]);
    setResultado(null);
    setError("");
  };

  const revisar = async () => {
    setCargando(true);
    setError("");
    try {
      setLineas(await api.previsualizarMasivo(conjuntoId, texto));
      setPaso("revisar");
    } catch (err: any) {
      setError(err.message || "No se pudo revisar la lista.");
    } finally {
      setCargando(false);
    }
  };

  const enviar = async () => {
    setCargando(true);
    setError("");
    try {
      const r = await api.enviarMasivo(conjuntoId, texto);
      setLineas(r.lineas);
      setResultado({ enviadas: r.enviadas, fallidas: r.fallidas });
      setPaso("listo");
      alTerminar();
    } catch (err: any) {
      setError(err.message || "No se pudieron enviar las invitaciones.");
    } finally {
      setCargando(false);
    }
  };

  return {
    paso,
    texto,
    setTexto,
    lineas,
    resultado,
    cargando,
    error,
    revisar,
    enviar,
    volver: () => setPaso("escribir"),
    reiniciar,
  };
}
