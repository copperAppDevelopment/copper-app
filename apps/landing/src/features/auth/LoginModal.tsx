import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { X, Eye, EyeOff, User, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { useStore } from "@nanostores/react";
import { isLoginOpenStore } from "../../stores/appStore";

export default function LoginModal() {
  const isOpen = useStore(isLoginOpenStore);

  const onClose = () => {
    isLoginOpenStore.set(false);
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Por favor ingrese todos los datos.");
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg("¡Sesión iniciada con éxito! Bienvenido al sistema Copper.");
      setTimeout(() => {
        onClose();
        setEmail("");
        setPassword("");
        setSuccessMsg("");
      }, 1800);
    }, 1500);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      onClick={onClose}
    >
      {/* Outer Modal Container with rounded corners */}
      <div 
        className="relative bg-white dark:bg-neutral-950 w-full max-w-5xl aspect-auto md:aspect-[1.6/1] rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-200 border border-zinc-200 dark:border-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button top-right over everything */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-50 p-2 text-zinc-500 hover:text-neutral-800 dark:text-zinc-400 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-transform duration-200 hover:scale-105"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ========================================================
            LEFT AREA: SOLID DEEP CRIMSON BRANDING (exactly like image)
            ======================================================== */}
        <div className="w-full md:w-[45%] bg-[#8A1C14] p-8 sm:p-12 flex flex-col justify-between relative text-white text-center md:text-left">
          
          {/* Logo container pill */}
          <div className="flex justify-center md:justify-start">
            <div className="bg-white rounded-full py-3 px-6 inline-flex items-center gap-2 shadow-md">
              {/* C logo shape as svg */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-[#8A1C14]"
              >
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" />
                <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="8" />
                <rect x="44" y="2" width="12" height="15" rx="2" fill="currentColor" />
                <rect x="44" y="83" width="12" height="15" rx="2" fill="currentColor" />
                <rect x="2" y="44" width="15" height="12" rx="2" fill="currentColor" />
              </svg>
              <span className="text-lg font-black tracking-widest text-[#8A1C14] font-display">
                OPPER
              </span>
            </div>
          </div>

          {/* Center Space Graphic & Slogan */}
          <div className="my-12 md:my-0 flex flex-col items-center space-y-8">
            {/* Outline Skyline Icon/Drawing styled to match bottom logo image */}
            <svg
              viewBox="0 0 200 130"
              className="w-48 h-auto opacity-95 text-white stroke-current fill-none stroke-2"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Back side properties */}
              <rect x="40" y="60" width="30" height="70" rx="2" strokeWidth="2.5" />
              {/* Middle building */}
              <rect x="80" y="20" width="40" height="110" rx="3" strokeWidth="2.5" />
              {/* Front right building */}
              <rect x="130" y="50" width="35" height="80" rx="2" strokeWidth="2.5" />
              
              {/* Windows layout - back building */}
              <line x1="48" y1="75" x2="52" y2="75" />
              <line x1="48" y1="85" x2="52" y2="85" />
              <line x1="48" y1="95" x2="52" y2="95" />
              <line x1="58" y1="75" x2="62" y2="75" />
              <line x1="58" y1="85" x2="62" y2="85" />
              <line x1="58" y1="95" x2="62" y2="95" />

              {/* Windows layout - center tall tower */}
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

              {/* Windows layout - front right building */}
              <line x1="140" y1="65" x2="145" y2="65" />
              <line x1="140" y1="78" x2="145" y2="78" />
              <line x1="140" y1="91" x2="145" y2="91" />
              <line x1="140" y1="104" x2="145" y2="104" />

              <line x1="152" y1="65" x2="157" y2="65" />
              <line x1="152" y1="78" x2="157" y2="78" />
              <line x1="152" y1="91" x2="157" y2="91" />
              <line x1="152" y1="104" x2="157" y2="104" />
            </svg>

            <div className="space-y-3">
              <p className="text-sm font-normal text-red-50 leading-relaxed max-w-sm">
                Accede a herramientas diseñadas para residentes, administradores y propietarios.
              </p>
              <p className="text-base font-extrabold tracking-wide text-white font-display">
                ¡Gestionar nunca fue tan fácil!
              </p>
            </div>
          </div>

          {/* Decorative Footer info */}
          <div className="hidden md:block">
            <p className="text-[10px] uppercase tracking-wider text-red-200/50 font-mono">
              Copper S.A.S © Colombia 2026
            </p>
          </div>

        </div>

        {/* ========================================================
            RIGHT AREA: INICIAR SESIÓN FORM GRID (exactly like image)
            ======================================================== */}
        <div className="flex-1 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-zinc-50 dark:bg-black transition-colors">
          
          <div className="max-w-md w-full mx-auto space-y-10">
            
            {/* Title block */}
            <div className="text-left space-y-3">
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-neutral-900 dark:text-white">
                Iniciar Sesión
              </h2>
            </div>

            {/* Notifications & warnings */}
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-100 text-red-800 text-xs font-semibold text-left">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-4 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold text-left flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 animate-pulse" />
                {successMsg}
              </div>
            )}

            {/* Input fields exactly matching the layouts */}
            <form onSubmit={handleSubmit} className="space-y-8 text-left">
              
              {/* Field 1: Email */}
              <div className="space-y-2 border-b border-zinc-200 dark:border-neutral-800 pb-2 relative focus-within:border-[#8A1C14] transition-colors">
                <label className="text-xs text-zinc-500 font-semibold block">
                  Email
                </label>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-zinc-400 shrink-0" />
                  <input
                    type="email"
                    required
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-none text-zinc-800 dark:text-white text-base outline-none placeholder:text-zinc-350 focus:ring-0 p-0"
                  />
                </div>
              </div>

              {/* Field 2: Password */}
              <div className="space-y-2 border-b border-zinc-200 dark:border-neutral-800 pb-2 relative focus-within:border-[#8A1C14] transition-colors">
                <label className="text-xs text-zinc-500 font-semibold block">
                  Contraseña
                </label>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 w-full">
                    <Lock className="w-5 h-5 text-zinc-400 shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent border-none text-zinc-850 dark:text-white text-base outline-none placeholder:text-zinc-350 focus:ring-0 p-0"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-zinc-400 hover:text-[#8A1C14] transition-colors cursor-pointer shrink-0"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Button "Iniciar sesión" in crimson */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-[#8A1C14] hover:bg-[#a1231a] active:bg-[#721710] text-white font-bold rounded-xl text-base tracking-wide transition-all duration-200 shadow-md cursor-pointer disabled:opacity-75 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Validando credenciales...
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </button>

            </form>

            {/* Bottom link: Suscribete ya matches image */}
            <div className="space-y-1.5 text-center pt-2">
              <p className="text-xs text-zinc-500 font-light">
                ¿Todavía no gestionas tus conjuntos con Copper App?
              </p>
              <button
                onClick={() => {
                  onClose();
                  const contactSection = document.getElementById("contacto");
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="inline-flex items-center gap-1.5 text-[#8A1C14] hover:text-red-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Suscríbete ya
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
