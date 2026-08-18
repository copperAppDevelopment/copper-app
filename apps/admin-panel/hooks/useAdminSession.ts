'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { getConjuntoSeleccionado } from "../lib/conjunto";

export interface AdminSession {
  loading: boolean;
  /** El uid de Supabase Auth, que es también `users.id` y `admins_conjuntos.user_id`. */
  userId: string;
  userEmail: string;
  conjuntoId: string;
  conjuntoNombre: string;
  hasMultipleConjuntos: boolean;
}

/**
 * Preámbulo común de las páginas de /admin: valida la sesión, exige rol Admin y resuelve
 * el conjunto seleccionado. Redirige a /login, / o /select-conjunto según el caso.
 *
 * Mientras `loading` sea true la página no debe consultar nada: `conjuntoId` aún está vacío.
 */
export function useAdminSession(): AdminSession {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [conjuntoId, setConjuntoId] = useState("");
  const [conjuntoNombre, setConjuntoNombre] = useState("");
  const [hasMultipleConjuntos, setHasMultipleConjuntos] = useState(false);

  useEffect(() => {
    let cancelado = false;

    async function verificar() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("rol")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profile?.rol !== "Admin") {
        router.push("/");
        return;
      }

      const conjunto = getConjuntoSeleccionado();
      if (!conjunto) {
        router.push("/select-conjunto");
        return;
      }

      const { data: userConjuntos } = await supabase
        .from("vista_mis_conjuntos_seleccion")
        .select("conjunto_id");

      const unicos = Array.from(new Set((userConjuntos || []).map(x => x.conjunto_id)));

      if (cancelado) return;

      setUserId(session.user.id);
      setUserEmail(session.user.email || "");
      setConjuntoId(conjunto.id);
      setConjuntoNombre(conjunto.nombre);
      setHasMultipleConjuntos(unicos.length > 1);
      setLoading(false);
    }

    verificar();
    return () => { cancelado = true; };
  }, [router]);

  return { loading, userId, userEmail, conjuntoId, conjuntoNombre, hasMultipleConjuntos };
}
