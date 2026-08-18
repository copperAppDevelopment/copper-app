'use client';

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

const MINIMO = 8;

/**
 * Restablecimiento de contraseña con el OTP nativo de Supabase.
 *
 * `resetPasswordForEmail` envía el código (la plantilla «Reset Password» debe usar
 * `{{ .Token }}`), `verifyOtp` con `type: 'recovery'` lo canjea por una sesión con permiso
 * de cambio, y `updateUser` fija la contraseña nueva.
 */
export function useCambioPassword(email: string, alTerminar: () => void) {
  const [paso, setPaso] = useState<"solicitar" | "confirmar">("solicitar");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const solicitar = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { error: errorEnvio } = await supabase.auth.resetPasswordForEmail(email);
      if (errorEnvio) {
        setError(errorEnvio.message);
        return;
      }
      setPaso("confirmar");
    } catch (err: any) {
      setError(err.message || "No se pudo enviar el código.");
    } finally {
      setLoading(false);
    }
  }, [email]);

  const confirmar = useCallback(async (codigo: string, password: string, repetida: string) => {
    if (password.length < MINIMO) {
      setError(`La contraseña debe tener al menos ${MINIMO} caracteres.`);
      return;
    }

    if (password !== repetida) {
      setError("Las dos contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { error: errorOtp } = await supabase.auth.verifyOtp({
        email,
        token: codigo,
        type: "recovery",
      });

      if (errorOtp) {
        setError("El código no es válido o ya expiró.");
        return;
      }

      const { error: errorPassword } = await supabase.auth.updateUser({ password });
      if (errorPassword) {
        setError(errorPassword.message);
        return;
      }

      alTerminar();
    } catch (err: any) {
      setError(err.message || "No se pudo cambiar la contraseña.");
    } finally {
      setLoading(false);
    }
  }, [email, alTerminar]);

  const reiniciar = useCallback(() => {
    setPaso("solicitar");
    setError("");
  }, []);

  return { paso, loading, error, setError, solicitar, confirmar, reiniciar };
}
