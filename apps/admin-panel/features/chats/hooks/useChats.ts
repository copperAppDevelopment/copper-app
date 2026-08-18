'use client';

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import * as api from "../api";
import type { Chat, FiltroEstadoChat } from "../types";
import type { EstadoChat } from "@/lib/chats";

export function useChats(conjuntoId: string, sesionCargando: boolean) {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstadoChat>("todos");

  const recargar = useCallback(async (id: string) => {
    try {
      setChats(await api.listarChats(id));
      setError("");
    } catch (e) {
      console.error("Error al cargar los chats:", e);
      setError("No se pudieron cargar las conversaciones.");
    }
  }, []);

  useEffect(() => {
    if (sesionCargando || !conjuntoId) return;
    (async () => {
      await recargar(conjuntoId);
      setLoading(false);
    })();
  }, [sesionCargando, conjuntoId, recargar]);

  /**
   * La lista depende de contadores y del último mensaje, que la vista calcula: en vez de
   * parchear en memoria se recarga. Escucha las dos tablas porque un chat nuevo llega por
   * `chats` y una respuesta por `chat_messages`.
   */
  useEffect(() => {
    if (sesionCargando || !conjuntoId) return;

    const canal = supabase
      .channel(`admin-chats:${conjuntoId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "chats" },
        () => recargar(conjuntoId))
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" },
        () => recargar(conjuntoId))
      .subscribe();

    return () => { supabase.removeChannel(canal); };
  }, [sesionCargando, conjuntoId, recargar]);

  const filtrados = React.useMemo(() => {
    const termino = filtro.trim().toLowerCase();
    return chats.filter(c => {
      if (filtroEstado !== "todos" && c.estado !== filtroEstado) return false;
      if (!termino) return true;
      const residente = `${c.residente_nombre ?? ""} ${c.residente_apellido ?? ""}`;
      return (
        c.asunto.toLowerCase().includes(termino) ||
        residente.toLowerCase().includes(termino) ||
        (c.ultimo_mensaje ?? "").toLowerCase().includes(termino)
      );
    });
  }, [chats, filtro, filtroEstado]);

  const totalNoLeidos = chats.reduce((s, c) => s + Number(c.no_leidos_admin ?? 0), 0);

  const cambiarEstado = async (chatId: string, estado: EstadoChat) => {
    await api.cambiarEstado(chatId, estado);
    await recargar(conjuntoId);
  };

  return {
    loading,
    error,
    chats: filtrados,
    totalNoLeidos,
    filtro,
    setFiltro,
    filtroEstado,
    setFiltroEstado,
    recargar: () => recargar(conjuntoId),
    cambiarEstado,
  };
}
