'use client';

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Lock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { setConjuntoSeleccionado, clearConjuntoSeleccionado } from "../../lib/conjunto";
import { RecuperarPasswordForm } from "../../components/auth/RecuperarPasswordForm";

export default function LoginPage() {
  const router = useRouter();
  const [modo, setModo] = useState<"entrar" | "recuperar">("entrar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [avisoMsg, setAvisoMsg] = useState("");

  // Clean up session if accessing login page to allow fresh sign-in
  useEffect(() => {
    supabase.auth.signOut();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Por favor ingrese todos los datos.");
      return;
    }
    setErrorMsg("");
    setAvisoMsg("");
    setIsSubmitting(true);

    try {
      // 1️⃣ Authenticate user using Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setErrorMsg(authError.message || "Credenciales incorrectas.");
        setIsSubmitting(false);
        return;
      }

      const authUser = authData?.user;
      if (!authUser) {
        setErrorMsg("Error al obtener la sesión de usuario.");
        setIsSubmitting(false);
        return;
      }

      // 2️⃣ Fetch public profile from 'users' table
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error al obtener perfil público:", profileError);
        setErrorMsg("Error al conectar con la base de datos.");
        setIsSubmitting(false);
        return;
      }

      if (!profile) {
        setErrorMsg("Perfil de usuario no encontrado. Regístrese con administración.");
        await supabase.auth.signOut();
        setIsSubmitting(false);
        return;
      }

      // 3️⃣ Verify user status (active/inactive)
      if (profile.estado === false) {
        setErrorMsg("Su cuenta se encuentra inactiva. Comuníquese con administración.");
        await supabase.auth.signOut();
        setIsSubmitting(false);
        return;
      }

      // 4️⃣ Check role and route accordingly
      //
      // Se navega en el acto. Antes había un cartel de «sesión iniciada» y un segundo de espera
      // para que diera tiempo a leerlo: un retardo puesto solo para justificar el mensaje.
      // `isSubmitting` se queda encendido mientras se navega, que es lo que evita el doble envío.
      const role = profile.rol;

      if (role === 'Residente') {
        // Residents only access via mobile
        router.push("/residente/no-access");
        return;
      }

      if (role === 'SuperAdmin') {
        router.push("/superadmin/dashboard");
        return;
      }

      // For Admin, Recepcion, Contador roles: Check complexes they manage
      const { data: userConjuntos, error: conjuntosError } = await supabase
        .from('vista_mis_conjuntos_seleccion')
        // Sin este filtro la vista devuelve los conjuntos de TODA la base: no hay RLS.
        .select('*')
        .eq('user_id', authUser.id);

      if (conjuntosError) {
        console.error("Error al obtener conjuntos asociados:", conjuntosError);
      }

      // Filter duplicates by conjunto_id to count unique complexes
      const uniqueConjuntos = (userConjuntos || []).filter((item, idx, self) =>
        item.conjunto_id && self.findIndex(t => t.conjunto_id === item.conjunto_id) === idx
      );
      const count = uniqueConjuntos.length;

      if (count === 0) {
        // If no complexes, redirect to role dashboard anyway but show empty state
        if (role === 'Admin') router.push("/admin/dashboard");
        else if (role === 'Recepcion') router.push("/recepcion/dashboard");
        else if (role === 'Contador') router.push("/contador/dashboard");
        else router.push("/");
      } else if (count === 1 && uniqueConjuntos[0]) {
        // If only 1 complex, auto-select it and go to dashboard
        const selectedConjunto = uniqueConjuntos[0];
        setConjuntoSeleccionado(selectedConjunto);

        if (role === 'Admin') router.push("/admin/dashboard");
        else if (role === 'Recepcion') router.push("/recepcion/dashboard");
        else if (role === 'Contador') router.push("/contador/dashboard");
        else router.push("/");
      } else {
        // If multiple complexes, redirect to selection screen
        clearConjuntoSeleccionado();
        router.push("/select-conjunto");
      }

    } catch (err: any) {
      console.error("Unexpected login error:", err);
      setErrorMsg("Ocurrió un error inesperado al iniciar sesión.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-slate-950 backdrop-blur-md md:p-8">
      {/* Outer Card Layout */}
      <div className="bg-white dark:bg-zinc-900 w-full max-w-5xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">

        {/* ========================================================
            LEFT COLUMN: BRAND CRIMSON GRAPHIC
            ======================================================== */}
        <div className="w-full md:w-[45%] bg-brand p-8 sm:p-12 flex flex-col justify-between relative text-white text-center md:text-left min-h-[320px] md:min-h-[550px]">
          {/* Logo container pill */}
          <div className="flex justify-center md:justify-start">
            <div className="bg-white rounded-full py-2 px-4.5 inline-flex items-center shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-copper.webp" alt="Copper Logo" className="h-6 object-contain" />
            </div>
          </div>

          {/* Center Graphic */}
          <div className="my-auto py-8 md:py-0 flex flex-col items-center space-y-6">
            <svg
              viewBox="0 0 200 130"
              className="w-40 h-auto opacity-95 text-white stroke-current fill-none stroke-2"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="40" y="60" width="30" height="70" rx="2" strokeWidth="2.5" />
              <rect x="80" y="20" width="40" height="110" rx="3" strokeWidth="2.5" />
              <rect x="130" y="50" width="35" height="80" rx="2" strokeWidth="2.5" />

              <line x1="48" y1="75" x2="52" y2="75" />
              <line x1="48" y1="85" x2="52" y2="85" />
              <line x1="48" y1="95" x2="52" y2="95" />
              <line x1="58" y1="75" x2="62" y2="75" />
              <line x1="58" y1="85" x2="62" y2="85" />
              <line x1="58" y1="95" x2="62" y2="95" />

              <line x1="90" y1="35" x2="96" y2="35" />
              <line x1="90" y1="48" x2="96" y2="48" />
              <line x1="90" y1="61" x2="96" y2="61" />
              <line x1="90" y1="74" x2="96" y2="74" />
              <line x1="90" y1="87" x2="96" y2="87" />
              <line x1="90" y1="100" x2="96" y2="100" />
              <line x1="90" y1="113" x2="96" y2="113" />
              <line x1="104" y1="35" x2="110" y2="35" />
              <line x1="104" y1="48" x2="110" y2="48" />
              <line x1="104" y1="61" x2="110" y2="61" />
              <line x1="104" y1="74" x2="110" y2="74" />
              <line x1="104" y1="87" x2="110" y2="87" />
              <line x1="104" y1="100" x2="110" y2="100" />
              <line x1="104" y1="113" x2="110" y2="113" />

              <line x1="140" y1="65" x2="145" y2="65" />
              <line x1="140" y1="78" x2="145" y2="78" />
              <line x1="140" y1="91" x2="145" y2="91" />
              <line x1="140" y1="104" x2="145" y2="104" />
              <line x1="152" y1="65" x2="157" y2="65" />
              <line x1="152" y1="78" x2="157" y2="78" />
              <line x1="152" y1="91" x2="157" y2="91" />
              <line x1="152" y1="104" x2="157" y2="104" />
            </svg>

            <div className="space-y-2 max-w-sm">
              <p className="text-sm font-normal text-red-100/90 leading-relaxed">
                Accede a las herramientas integradas para la gestión administrativa de tu copropiedad.
              </p>
              <p className="text-base font-extrabold tracking-wide text-white">
                ¡Gestionar nunca fue tan fácil!
              </p>
            </div>
          </div>

          <div className="hidden md:block">
            <p className="text-[10px] uppercase tracking-wider text-red-200/50 font-mono">
              Copper S.A.S © Colombia 2026
            </p>
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: LOGIN FORM
            ======================================================== */}
        <div className="flex-1 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white dark:bg-zinc-900">
          {modo === "recuperar" ? (
            <RecuperarPasswordForm
              onVolver={(aviso) => {
                setModo("entrar");
                setErrorMsg("");
                setPassword("");
                setAvisoMsg(aviso ?? "");
              }}
            />
          ) : (
          <div className="max-w-md w-full mx-auto space-y-10">

            <div className="text-left space-y-2">
              <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                Iniciar Sesión
              </h2>
              <p className="text-sm text-zinc-550 dark:text-zinc-400">
                Portal administrativo de propiedad horizontal
              </p>
            </div>

            {/* Error & Success States */}
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-950/80 border border-red-900 text-red-200 text-xs font-semibold text-left flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
            {avisoMsg && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-900 text-emerald-200 text-xs font-semibold text-left flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>{avisoMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 text-left">
              {/* Email */}
              <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 relative focus-within:border-brand transition-colors">
                <label className="text-xs text-zinc-555 dark:text-zinc-450 font-semibold block">
                  Correo Electrónico
                </label>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                  <input
                    type="email"
                    required
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-none text-zinc-800 dark:text-white text-base outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:ring-0 p-0"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 relative focus-within:border-brand transition-colors">
                <label className="text-xs text-zinc-555 dark:text-zinc-450 font-semibold block">
                  Contraseña
                </label>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 w-full">
                    <Lock className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent border-none text-zinc-800 dark:text-white text-base outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-650 focus:ring-0 p-0"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-zinc-500 hover:text-brand transition-colors cursor-pointer shrink-0"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end -mt-4">
                <button
                  type="button"
                  onClick={() => { setModo("recuperar"); setErrorMsg(""); setAvisoMsg(""); }}
                  className="text-xs text-zinc-500 hover:text-brand transition-colors cursor-pointer"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-brand hover:bg-brand-hover active:bg-brand-active text-white font-bold rounded-xl text-base tracking-wide transition-all duration-200 shadow-md cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </form>

            {/* Bottom info link */}
            <div className="space-y-1.5 text-center pt-2">
              <p className="text-xs text-zinc-500 font-light">
                ¿Aún no tienes cuenta? Registra tu copropiedad en unos minutos
              </p>
              {/* Antes esto apuntaba a `http://localhost:3000` en duro, así que en producción
                  llevaba a ninguna parte. */}
              <a
                href="/registro"
                className="inline-flex items-center gap-1.5 text-brand hover:text-brand-hover font-bold text-xs transition-colors cursor-pointer"
              >
                Crear mi cuenta
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
          )}
        </div>

      </div>
    </div>
  );
}
