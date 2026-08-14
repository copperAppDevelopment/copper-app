'use client';

import { useRouter } from "next/navigation";
import { Smartphone, Download, ArrowLeft, LogOut } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";

export default function ResidenteNoAccessPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-slate-950 text-zinc-900 dark:text-white md:p-8">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-[32px] overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-850 p-8 sm:p-12 text-center space-y-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Brand Header */}
        <div className="flex justify-center">
          <div className="bg-brand/10 border border-brand/20 rounded-full py-2 px-4 inline-flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-brand"
            >
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" />
              <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="8" />
              <rect x="44" y="2" width="12" height="15" rx="2" fill="currentColor" />
              <rect x="44" y="83" width="12" height="15" rx="2" fill="currentColor" />
              <rect x="2" y="44" width="15" height="12" rx="2" fill="currentColor" />
            </svg>
            <span className="text-sm font-black tracking-widest text-zinc-900 dark:text-white">
              COPPER APP
            </span>
          </div>
        </div>

        {/* Smartphone Icon Illustration */}
        <div className="flex justify-center relative">
          <div className="w-24 h-24 bg-brand/15 rounded-full flex items-center justify-center animate-pulse border border-brand/20">
            <Smartphone className="w-12 h-12 text-brand" />
          </div>
          <div className="absolute top-1 right-[40%] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full p-1.5 text-zinc-650 dark:text-zinc-300">
            <Download className="w-4 h-4" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-display">
            Acceso Móvil Exclusivo
          </h2>
          <p className="text-zinc-550 dark:text-zinc-400 text-sm leading-relaxed max-w-md mx-auto">
            Estimado residente, el portal administrativo web está diseñado únicamente para el personal de administración, contabilidad y recepción.
          </p>
          <p className="text-zinc-700 dark:text-zinc-300 text-sm font-semibold">
            ¡Descarga nuestra aplicación móvil oficial para gestionar tu copropiedad!
          </p>
        </div>

        {/* Download Badges (Mocks) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          {/* Google Play */}
          <a
            href="#"
            className="flex items-center gap-3 bg-black hover:bg-zinc-950 active:scale-98 border border-zinc-800 rounded-xl px-5 py-3 w-52 text-left transition-all duration-200"
            onClick={(e) => {
              e.preventDefault();
              alert("La aplicación de Android estará disponible próximamente en Google Play Store.");
            }}
          >
            {/* Play Store custom icon */}
            <svg viewBox="0 0 512 512" className="w-6 h-6 text-emerald-400 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58-33.2-65.6 65.6 65.6 65.6 58-33.2c15-8.6 25.2-24.3 25.2-42.4s-10.2-33.8-25.2-42.4zM325.3 277.7l60.1 60.1L104.6 499l220.7-221.3z" />
            </svg>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold leading-none">Descárgalo en</div>
              <div className="text-sm font-bold text-white leading-tight">Google Play</div>
            </div>
          </a>

          {/* App Store */}
          <a
            href="#"
            className="flex items-center gap-3 bg-black hover:bg-zinc-950 active:scale-98 border border-zinc-800 rounded-xl px-5 py-3 w-52 text-left transition-all duration-200"
            onClick={(e) => {
              e.preventDefault();
              alert("La aplicación de iOS estará disponible próximamente en el Apple App Store.");
            }}
          >
            {/* Apple custom icon */}
            <svg viewBox="0 0 384 512" className="w-6 h-6 text-white fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-48.7-19.1-77.5-19.1-38.2 0-77.5 21.4-97.5 56.1-41.2 71.1-10.5 176.6 29.3 234 19.5 28.1 42.6 59.3 72.8 58.1 30.1-1.2 41.5-19.1 77.5-19.1 35.8 0 46.3 19.1 77.5 18.5 31.4-.6 51.8-28.1 71.1-56.1 22.3-32.8 31.4-64.7 31.8-66.4-.7-.3-61.4-23.5-62-93.3zM250.7 76.6c16-19.4 26.6-46.4 23.6-76.6-25.6 1-56.7 17-75.1 38.6-16 18.8-30.1 46.1-26.6 75.7 28.3 2.2 57.6-18.3 78.1-37.7z" />
            </svg>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold leading-none">Consíguelo en el</div>
              <div className="text-sm font-bold text-white leading-tight">App Store</div>
            </div>
          </a>
        </div>

        {/* Buttons: Back to Login */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
          <button
            onClick={() => router.push("/login")}
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Iniciar Sesión
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>

      </div>
    </div>
  );
}
