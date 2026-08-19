'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

/** El rol global, tal cual está escrito en `users.rol`: la comparación es sensible a mayúsculas. */
export const ROL_SUPERADMIN = "SuperAdmin";

export interface SesionSuperAdmin {
  loading: boolean;
  /** El uid de Supabase Auth, que es también `users.id`. */
  userId: string;
  userEmail: string;
}

/**
 * Preámbulo de las páginas de /superadmin: valida la sesión y exige el rol global.
 *
 * Aparte de `useSesionPanel` a propósito, y no como una variante suya con un `exigeConjunto`:
 * aquel resuelve el conjunto seleccionado y redirige a /select-conjunto si falta, mientras que
 * el SuperAdmin no pertenece a ningún conjunto —no está en `admins_conjuntos`— y nunca pasa por
 * esa pantalla. Meterlo allí dejaría `conjuntoId`, `conjuntoNombre` y `hasMultipleConjuntos`
 * vacíos para este único llamante.
 *
 * `RolEquipo` tampoco lo incluye, y es deliberado: ese tipo es el rol *dentro de un conjunto* y
 * alimenta el `roles` de `withAdminConjunto`. Añadir SuperAdmin ahí lo colaría en la autorización
 * por conjunto.
 *
 * Quien no cumple va a `/`, que a su vez lo enruta a su propio dashboard: no hay bucle.
 */
export function useSuperAdminSession(): SesionSuperAdmin {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");

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
        .select("rol, estado")
        .eq("id", session.user.id)
        .maybeSingle();

      // `estado` también, y no solo el rol: entrando por la URL directa esta comprobación es
      // la única que hay, y un SuperAdmin desactivado pasaría. `app/page.tsx` sí lo mira.
      if (String(profile?.rol ?? "") !== ROL_SUPERADMIN || profile?.estado === false) {
        router.push("/");
        return;
      }

      if (cancelado) return;

      setUserId(session.user.id);
      setUserEmail(session.user.email || "");
      setLoading(false);
    }

    verificar();
    return () => { cancelado = true; };
  }, [router]);

  return { loading, userId, userEmail };
}
