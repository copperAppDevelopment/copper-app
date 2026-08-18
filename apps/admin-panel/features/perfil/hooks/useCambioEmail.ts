'use client';

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

/**
 * Cambio de correo en dos pasos, sobre el OTP nativo de Supabase Auth.
 *
 * `updateUser({ email })` emite un código de 6 dígitos al correo nuevo — siempre que la
 * plantilla «Change Email Address» use `{{ .Token }}` y «Secure email change» esté
 * desactivado; con esa opción activa Supabase pediría además un código al correo anterior.
 *
 * La contraseña actual se revalida antes de empezar: sin ella, cualquiera con una sesión
 * abierta podría apropiarse de la cuenta cambiando el correo.
 */
export function useCambioEmail(emailActual: string, alTerminar: () => void) {
  const [paso, setPaso] = useState<"solicitar" | "confirmar">("solicitar");
  const [emailNuevo, setEmailNuevo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const solicitar = useCallback(async (nuevo: string, password: string) => {
    const limpio = nuevo.trim().toLowerCase();

    if (!limpio || !limpio.includes("@")) {
      setError("Escribe un correo válido.");
      return;
    }

    if (limpio === emailActual.toLowerCase()) {
      setError("Ese ya es tu correo actual.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { error: errorPassword } = await supabase.auth.signInWithPassword({
        email: emailActual,
        password,
      });

      if (errorPassword) {
        setError("La contraseña actual no es correcta.");
        return;
      }

      const { error: errorCambio } = await supabase.auth.updateUser({ email: limpio });
      if (errorCambio) {
        setError(errorCambio.message);
        return;
      }

      setEmailNuevo(limpio);
      setPaso("confirmar");
    } catch (err: any) {
      setError(err.message || "No se pudo iniciar el cambio de correo.");
    } finally {
      setLoading(false);
    }
  }, [emailActual]);

  const confirmar = useCallback(async (codigo: string) => {
    setLoading(true);
    setError("");
    try {
      const { error: errorOtp } = await supabase.auth.verifyOtp({
        email: emailNuevo,
        token: codigo,
        type: "email_change",
      });

      if (errorOtp) {
        setError("El código no es válido o ya expiró.");
        return;
      }

      // `public.users.email` lo actualiza el trigger `trg_sync_email`.
      alTerminar();
    } catch (err: any) {
      setError(err.message || "No se pudo confirmar el código.");
    } finally {
      setLoading(false);
    }
  }, [emailNuevo, alTerminar]);

  const reiniciar = useCallback(() => {
    setPaso("solicitar");
    setEmailNuevo("");
    setError("");
  }, []);

  return { paso, emailNuevo, loading, error, setError, solicitar, confirmar, reiniciar };
}
