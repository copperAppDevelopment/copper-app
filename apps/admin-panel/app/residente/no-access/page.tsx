'use client';

import { useRouter } from "next/navigation";
import { Smartphone, Download, ArrowLeft, LogOut } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import { BotonesTiendas } from "@/components/tiendas/BotonesTiendas";

export default function ResidenteNoAccessPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-slate-950 text-zinc-900 dark:text-white md:p-8">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-[32px] overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-850 p-8 sm:p-12 text-center space-y-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Logo */}
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-copper.webp" alt="Copper" className="h-10 object-contain" />
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

        <BotonesTiendas />

        {/* Buttons: Back to Login */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
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
