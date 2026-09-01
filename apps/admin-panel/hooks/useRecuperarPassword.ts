'use client';

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

export const MINIMO_PASSWORD = 8;

/**
 * Restablecimiento de contraseña con el OTP nativo de Supabase, en dos pasos.
 *
 * `resetPasswordForEmail` envía el código —la plantilla «Reset Password» del dashboard debe usar
 * `{{ .Token }}` y no `{{ .ConfirmationURL }}`—, `verifyOtp` con `type: 'recovery'` lo canjea por
 * una sesión con permiso de cambio, y `updateUser` fija la contraseña nueva.
 *
 * Lo usan el modal del perfil, que ya conoce el correo, y la recuperación del login, donde el
 * usuario lo escribe: por eso `solicitar` lo recibe como argumento en vez de fijarlo al crear
 * el hook.
 *
 * ⚠️ `confirmar` deja **una sesión abierta** para el dueño de ese correo, que sustituye a la
 * que hubiera. Desde el login hay que cerrarla (`cerrarSesion`) antes de devolver al usuario
 * al formulario, o se salta el enrutado por rol.
 */
export function useRecuperarPassword(alTerminar: () => void) {
  const [paso, setPaso] = useState<"solicitar" | "confirmar">("solicitar");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const solicitar = useCallback(async (correo: string) => {
    const limpio = correo.trim().toLowerCase();

    if (!limpio || !limpio.includes("@")) {
      setError("Escribe un correo válido.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { error: errorEnvio } = await supabase.auth.resetPasswordForEmail(limpio);
      if (errorEnvio) {
        setError(errorEnvio.message);
        return;
      }

      // Supabase responde igual exista o no la cuenta, y aquí se respeta: un mensaje del tipo
      // «ese correo no está registrado» convertiría el login en un verificador de correos.
      setEmail(limpio);
      setPaso("confirmar");
    } catch (err: any) {
      setError(err.message || "No se pudo enviar el código.");
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmar = useCallback(async (codigo: string, password: string, repetida: string) => {
    if (password.length < MINIMO_PASSWORD) {
      setError(`La contraseña debe tener al menos ${MINIMO_PASSWORD} caracteres.`);
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
    setEmail("");
    setError("");
  }, []);

  return { paso, email, loading, error, setError, solicitar, confirmar, reiniciar };
}
