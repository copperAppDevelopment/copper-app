'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { getConjuntoSeleccionado } from "../lib/conjunto";
import type { RolEquipo } from "../lib/equipo";

export interface SesionPanel {
  loading: boolean;
  /** El uid de Supabase Auth, que es también `users.id` y `admins_conjuntos.user_id`. */
  userId: string;
  userEmail: string;
  /** Rol con el que entró; los shells lo usan para el pie del sidebar. */
  rol: RolEquipo | null;
  conjuntoId: string;
  conjuntoNombre: string;
  hasMultipleConjuntos: boolean;
}

/**
 * Preámbulo común de las páginas del panel: valida la sesión, exige uno de los roles
 * indicados y resuelve el conjunto seleccionado. Redirige a /login, / o /select-conjunto
 * según el caso.
 *
 * Está parametrizado por rol porque la página de recepción la comparten dos rutas —una
 * para el administrador y otra para el recepcionista— y solo cambia quién puede entrar.
 * Quien no cumple va a `/`, que a su vez lo enruta a su propio dashboard: no hay bucle.
 *
 * Mientras `loading` sea true la página no debe consultar nada: `conjuntoId` aún está vacío.
 */
export function useSesionPanel(rolesPermitidos: RolEquipo[]): SesionPanel {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [rol, setRol] = useState<RolEquipo | null>(null);
  const [conjuntoId, setConjuntoId] = useState("");
  const [conjuntoNombre, setConjuntoNombre] = useState("");
  const [hasMultipleConjuntos, setHasMultipleConjuntos] = useState(false);

  // Se serializa para no reiniciar el efecto en cada render por la identidad del array.
  const clave = rolesPermitidos.join(",");

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
        .select("rol, estado, cuenta_bloqueada")
        .eq("id", session.user.id)
        .maybeSingle();

      // Una cuenta desactivada o vetada por el SuperAdmin sale a /login, y no a `/`, para que
      // vea el motivo. Antes aquí solo se miraba el rol: quien ya estuviera dentro conservaba
      // la navegación del panel hasta cerrar sesión.
      if (profile?.estado === false || profile?.cuenta_bloqueada === true) {
        await supabase.auth.signOut();
        router.push("/login");
        return;
      }

      const suyo = String(profile?.rol ?? "");
      if (!clave.split(",").includes(suyo)) {
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
        // Sin este filtro la vista devuelve los conjuntos de TODA la base: no hay RLS.
        .select("conjunto_id")
        .eq("user_id", session.user.id);

      const unicos = Array.from(new Set((userConjuntos || []).map(x => x.conjunto_id)));

      if (cancelado) return;

      setUserId(session.user.id);
      setUserEmail(session.user.email || "");
      setRol(suyo as RolEquipo);
      setConjuntoId(conjunto.id);
      setConjuntoNombre(conjunto.nombre);
      setHasMultipleConjuntos(unicos.length > 1);
      setLoading(false);
    }

    verificar();
    return () => { cancelado = true; };
  }, [router, clave]);

  return { loading, userId, userEmail, rol, conjuntoId, conjuntoNombre, hasMultipleConjuntos };
}
