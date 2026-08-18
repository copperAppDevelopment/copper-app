'use client';

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

/**
 * Total de mensajes de residentes sin leer en el conjunto.
 *
 * El sidebar lo muestra como globo: al no haber push web para el administrador, es lo único
 * que le avisa de un mensaje nuevo mientras está en otra página del panel.
 */
export function useNoLeidos(conjuntoId: string): number {
  const [total, setTotal] = useState(0);

  const recargar = useCallback(async (id: string) => {
    const { data, error } = await supabase
      .from("vista_chats_usuario")
      .select("no_leidos_admin")
      .eq("conjunto_id", id);

    if (error) {
      console.error("Error al contar los mensajes sin leer:", error);
      return;
    }

    setTotal((data ?? []).reduce((s, c: any) => s + Number(c.no_leidos_admin ?? 0), 0));
  }, []);

  useEffect(() => {
    if (!conjuntoId) return;

    recargar(conjuntoId);

    const canal = supabase
      .channel(`no-leidos:${conjuntoId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" },
        () => recargar(conjuntoId))
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "chats" },
        () => recargar(conjuntoId))
      .subscribe();

    return () => { supabase.removeChannel(canal); };
  }, [conjuntoId, recargar]);

  return total;
}
