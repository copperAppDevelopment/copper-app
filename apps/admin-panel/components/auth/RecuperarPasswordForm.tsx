'use client';

import * as React from "react";
import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, AlertCircle, MailCheck } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { CodigoInput } from "@/components/ui/codigo-input";
import { useRecuperarPassword, MINIMO_PASSWORD } from "@/hooks/useRecuperarPassword";

export interface RecuperarPasswordFormProps {
  /** Se llama al volver al formulario de acceso, con el aviso a mostrar allí. */
  onVolver: (aviso?: string) => void;
}

/**
 * Recuperación de contraseña desde el login, con el mismo OTP de 6 dígitos que el perfil.
 *
 * Vive fuera de `features/` porque lo comparten dos pantallas y las *features* no se importan
 * entre sí. El formulario se pinta dentro de la tarjeta del login, no en una ruta aparte: así
 * no hay una URL más que dejar accesible sin sesión.
 */
export function RecuperarPasswordForm({ onVolver }: RecuperarPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [repetida, setRepetida] = useState("");
  const [verPassword, setVerPassword] = useState(false);

  const r = useRecuperarPassword(async () => {
    // `verifyOtp` deja abierta una sesión del dueño del correo. Si se dejara, el usuario
    // entraría al panel saltándose el enrutado por rol del login, y un Residente acabaría
    // dentro. Se cierra y se le devuelve al formulario a entrar con la contraseña nueva.
    await supabase.auth.signOut();
    onVolver("Contraseña actualizada. Entra con ella.");
  });

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (r.paso === "solicitar") r.solicitar(email);
    else r.confirmar(codigo, password, repetida);
  };

  const esSolicitud = r.paso === "solicitar";

  return (
    <div className="max-w-md w-full mx-auto space-y-8">
      <div className="text-left space-y-2">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
          Recuperar contraseña
        </h2>
        <p className="text-sm text-zinc-550 dark:text-zinc-400">
          {esSolicitud
            ? "Te enviamos un código de 6 dígitos para que elijas una contraseña nueva."
            : `Escribe el código que enviamos a ${r.email} y tu contraseña nueva.`}
        </p>
      </div>

      {r.error && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-900 text-red-200 text-xs font-semibold text-left flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <span>{r.error}</span>
        </div>
      )}

      {!esSolicitud && !r.error && (
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-medium text-left flex items-start gap-2.5">
          <MailCheck className="w-5 h-5 text-brand shrink-0 mt-0.5" />
          {/* Supabase responde igual exista o no la cuenta, y el mensaje lo respeta: decir
              «ese correo no está registrado» convertiría el login en un verificador. */}
          <span>Si el correo está registrado, el código ya está en la bandeja de entrada.</span>
        </div>
      )}

      <form onSubmit={enviar} className="space-y-8 text-left">
        {esSolicitud ? (
          <CampoLinea etiqueta="Correo Electrónico" icono={<Mail className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0" />}>
            <input
              type="email"
              required
              autoFocus
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={r.loading}
              className="w-full bg-transparent border-none text-zinc-800 dark:text-white text-base outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-0 p-0"
            />
          </CampoLinea>
        ) : (
          <>
            <CodigoInput valor={codigo} onChange={setCodigo} disabled={r.loading} />

            <CampoLinea
              etiqueta="Contraseña Nueva"
              icono={<Lock className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0" />}
              accion={
                <button
                  type="button"
                  onClick={() => setVerPassword(!verPassword)}
                  className="text-zinc-500 hover:text-brand transition-colors cursor-pointer shrink-0"
                  aria-label={verPassword ? "Ocultar la contraseña" : "Mostrar la contraseña"}
                >
                  {verPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
            >
              <input
                type={verPassword ? "text" : "password"}
                required
                placeholder={`Mínimo ${MINIMO_PASSWORD} caracteres`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={r.loading}
                className="w-full bg-transparent border-none text-zinc-800 dark:text-white text-base outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-650 focus:ring-0 p-0"
              />
            </CampoLinea>

            <CampoLinea etiqueta="Repite la Contraseña" icono={<Lock className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0" />}>
              <input
                type={verPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                value={repetida}
                onChange={(e) => setRepetida(e.target.value)}
                disabled={r.loading}
                className="w-full bg-transparent border-none text-zinc-800 dark:text-white text-base outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-650 focus:ring-0 p-0"
              />
            </CampoLinea>
          </>
        )}

        <button
          type="submit"
          disabled={r.loading || (!esSolicitud && codigo.length !== 6)}
          className="w-full py-4 px-6 bg-brand hover:bg-brand-hover active:bg-brand-active text-white font-bold rounded-xl text-base tracking-wide transition-all duration-200 shadow-md cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {r.loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {esSolicitud ? "Enviando…" : "Guardando…"}
            </>
          ) : (
            esSolicitud ? "Enviar código" : "Cambiar contraseña"
          )}
        </button>
      </form>

      <div className="text-center pt-2 space-y-2">
        {!esSolicitud && (
          <button
            onClick={() => { setCodigo(""); r.reiniciar(); }}
            disabled={r.loading}
            className="block w-full text-xs text-zinc-500 hover:text-brand transition-colors cursor-pointer disabled:opacity-50"
          >
            Usar otro correo o pedir el código de nuevo
          </button>
        )}
        <button
          onClick={() => onVolver()}
          disabled={r.loading}
          className="inline-flex items-center gap-1.5 text-brand hover:text-brand-hover font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver a iniciar sesión
        </button>
      </div>
    </div>
  );
}

/** El campo subrayado del login: etiqueta arriba, icono a la izquierda y línea inferior. */
function CampoLinea({
  etiqueta, icono, accion, children,
}: {
  etiqueta: string;
  icono: React.ReactNode;
  accion?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 relative focus-within:border-brand transition-colors">
      <label className="text-xs text-zinc-555 dark:text-zinc-450 font-semibold block">
        {etiqueta}
      </label>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full">
          {icono}
          {children}
        </div>
        {accion}
      </div>
    </div>
  );
}
