'use client';

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import * as api from "../conjuntosApi";
import type { ConjuntoAdmin } from "../conjuntosTypes";

export function useMisConjuntos() {
  const [conjuntos, setConjuntos] = useState<ConjuntoAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelado = false;

    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const lista = await api.listarMisConjuntos(session.user.id);
        if (!cancelado) setConjuntos(lista);
      } catch (e) {
        console.error("Error al cargar los conjuntos:", e);
        if (!cancelado) setError("No se pudieron cargar tus conjuntos.");
      } finally {
        if (!cancelado) setLoading(false);
      }
    })();

    return () => { cancelado = true; };
  }, []);

  return { conjuntos, loading, error };
}
