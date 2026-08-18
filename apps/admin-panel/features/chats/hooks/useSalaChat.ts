'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import * as api from "../api";
import type { Mensaje } from "../types";

export function useSalaChat(chatId: string | null, alEnviar?: () => void) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  /** URL firmada por `file_name`; el bucket es privado y firmar en cada render sería absurdo. */
  const [adjuntos, setAdjuntos] = useState<Record<string, string>>({});
  const firmados = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!chatId) {
      setMensajes([]);
      return;
    }

    let cancelado = false;
    setLoading(true);

    (async () => {
      try {
        const lista = await api.listarMensajes(chatId);
        if (cancelado) return;
        setMensajes(lista);
        setError("");
        // Al abrirlo se da por leído lo que haya llegado.
        await api.marcarLeido(chatId);
      } catch (e) {
        console.error("Error al cargar la conversación:", e);
        if (!cancelado) setError("No se pudo cargar la conversación.");
      } finally {
        if (!cancelado) setLoading(false);
      }
    })();

    return () => { cancelado = true; };
  }, [chatId]);

  // Mismo patrón que el móvil: el insert propio puede llegar por aquí y por la respuesta
  // del POST, así que se descarta por id.
  useEffect(() => {
    if (!chatId) return;

    const canal = supabase
      .channel(`sala:${chatId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `chat_id=eq.${chatId}` },
        (payload) => {
          const nuevo = payload.new as Mensaje;
          setMensajes(previos =>
            previos.some(m => m.id === nuevo.id) ? previos : [...previos, nuevo]
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(canal); };
  }, [chatId]);

  // Firma los adjuntos que aún no tienen URL.
  useEffect(() => {
    const pendientes = mensajes
      .map(m => m.file_name)
      .filter((p): p is string => Boolean(p) && !firmados.current.has(p!));

    if (pendientes.length === 0) return;

    pendientes.forEach(p => firmados.current.add(p));

    Promise.all(pendientes.map(async p => [p, await api.firmarAdjunto(p)] as const))
      .then(pares => {
        const nuevos = Object.fromEntries(
          pares.filter((par): par is [string, string] => Boolean(par[1]))
        );
        if (Object.keys(nuevos).length > 0) {
          setAdjuntos(previos => ({ ...previos, ...nuevos }));
        }
      });
  }, [mensajes]);

  const enviar = useCallback(async (contenido: string, archivo: File | null) => {
    if (!chatId) return;

    setEnviando(true);
    setError("");
    try {
      const json = await api.enviarMensaje(chatId, contenido, archivo);
      const nuevo = json.data as Mensaje;
      setMensajes(previos =>
        previos.some(m => m.id === nuevo.id) ? previos : [...previos, nuevo]
      );
      alEnviar?.();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setEnviando(false);
    }
  }, [chatId, alEnviar]);

  return { mensajes, adjuntos, loading, enviando, error, enviar };
}
