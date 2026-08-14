'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, Mail, LogOut, LayoutDashboard,
  RefreshCw, ClipboardList, Plus, PhoneCall
} from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import { getConjuntoSeleccionado, clearConjuntoSeleccionado } from "../../../lib/conjunto";

export default function RecepcionDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
    const [conjuntoNombre, setConjuntoNombre] = useState("");
  const [hasMultipleConjuntos, setHasMultipleConjuntos] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      
      setUserEmail(session.user.email || "");

      // Verify role
      const { data: profile } = await supabase
        .from("users")
        .select("rol")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profile?.rol !== "Recepcion") {
        router.push("/");
        return;
      }

      // Check current selected complex from localStorage
      setConjuntoNombre(getConjuntoSeleccionado()?.nombre || "Conjunto Residencial");

      // Verify if has multiple complexes
      const { data: userConjuntos } = await supabase
        .from("vista_mis_conjuntos_seleccion")
        .select("conjunto_id");

      if (userConjuntos && userConjuntos.length > 1) {
        setHasMultipleConjuntos(true);
      }

      setLoading(false);
    }
    checkAccess();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    router.push("/login");
  };

  const handleBackToSelection = () => {
    clearConjuntoSeleccionado();
    router.push("/select-conjunto");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row">
      {/* ========================================================
          SIDEBAR NAVIGATION
          ======================================================== */}
      <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-copper.webp" alt="Copper Logo" className="h-8 object-contain" />
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            <a
              href="#"
              className="flex items-center gap-3 bg-brand/10 text-brand px-4 py-3 rounded-xl text-sm font-semibold transition-all"
            >
              <LayoutDashboard className="w-5 h-5" />
              Portería Principal
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-zinc-400 hover:text-white hover:bg-zinc-850 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              onClick={(e) => e.preventDefault()}
            >
              <ClipboardList className="w-5 h-5" />
              Bitácora de Visitas
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-zinc-400 hover:text-white hover:bg-zinc-850 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              onClick={(e) => e.preventDefault()}
            >
              <Mail className="w-5 h-5" />
              Correspondencia
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-zinc-400 hover:text-white hover:bg-zinc-850 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              onClick={(e) => e.preventDefault()}
            >
              <PhoneCall className="w-5 h-5" />
              Directorio / Citófono
            </a>
          </nav>
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-zinc-800 space-y-3">
          {hasMultipleConjuntos && (
            <button
              onClick={handleBackToSelection}
              className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-300 hover:text-white py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Cambiar Entrada
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center border border-brand/35 text-brand font-bold text-xs">
              RE
            </div>
            <div className="truncate text-left">
              <p className="text-xs text-white font-semibold truncate">{userEmail}</p>
              <p className="text-[10px] text-zinc-500 font-mono">PORTERÍA / RECEPCIÓN</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ========================================================
          MAIN CONTENT AREA
          ======================================================== */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        {/* Header bar */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{conjuntoNombre}</h1>
            <p className="text-sm text-zinc-400">Panel de Control de Recepción y Control de Acceso</p>
          </div>
          <span className="flex items-center gap-1.5 bg-brand/10 border border-brand/25 text-brand px-3 py-1.5 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            Vigilancia Activa
          </span>
        </header>

        {/* Grid Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-2">
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Visitas del Día</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold">12</span>
              <span className="text-emerald-500 text-xs font-bold">Ingresos</span>
            </div>
            <p className="text-[10px] text-zinc-500">Personas externas registradas hoy</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-2">
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Correspondencia</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold">3</span>
              <span className="text-brand text-xs font-bold">En Custodia</span>
            </div>
            <p className="text-[10px] text-zinc-500">Paquetes pendientes por reclamar</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-2">
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Autorizaciones</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold">8</span>
              <span className="text-emerald-500 text-xs font-bold">Activas</span>
            </div>
            <p className="text-[10px] text-zinc-500">Códigos QR / invitaciones programadas</p>
          </div>
        </section>

        {/* Content sections */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl text-left space-y-4">
              <h2 className="text-lg font-bold text-white">Operaciones de Portería</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-brand/40 transition-colors cursor-pointer flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-white">Registrar Entrada de Visita</h3>
                    <p className="text-xs text-zinc-400 mt-1">Ingresa nombres, documento, vehículo y apto destino.</p>
                  </div>
                  <Plus className="w-5 h-5 text-brand" />
                </div>
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-brand/40 transition-colors cursor-pointer flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-white">Registrar Paquete / Correo</h3>
                    <p className="text-xs text-zinc-400 mt-1">Registra correspondencia y notifica automáticamente al residente.</p>
                  </div>
                  <Plus className="w-5 h-5 text-brand" />
                </div>
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-brand/40 transition-colors cursor-pointer flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-white">Validar QR de Invitado</h3>
                    <p className="text-xs text-zinc-400 mt-1">Verifica la validez de un código de acceso rápido.</p>
                  </div>
                  <Plus className="w-5 h-5 text-brand" />
                </div>
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-brand/40 transition-colors cursor-pointer flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-white">Reportar Incidencia</h3>
                    <p className="text-xs text-zinc-400 mt-1">Registra novedades de seguridad en la minuta.</p>
                  </div>
                  <Plus className="w-5 h-5 text-brand" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent entries */}
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl text-left space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Últimos Ingresos
              </h2>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                  <div>
                    <p className="text-xs font-semibold text-white">Juan Carlos Pérez</p>
                    <p className="text-[10px] text-zinc-500">C.C. 1023456 • Apto 402-A</p>
                  </div>
                  <span className="text-[10px] bg-emerald-950 border border-emerald-900 text-emerald-400 px-2 py-0.5 rounded-full font-bold">Adentro</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                  <div>
                    <p className="text-xs font-semibold text-white">Sandra Milena Ortiz</p>
                    <p className="text-[10px] text-zinc-500">Vehículo JKL-987 • Apto 101-C</p>
                  </div>
                  <span className="text-[10px] bg-emerald-950 border border-emerald-900 text-emerald-400 px-2 py-0.5 rounded-full font-bold">Adentro</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <p className="text-xs font-semibold text-white">Mensajería Servientrega</p>
                    <p className="text-[10px] text-zinc-500">Entregó paquete en portería</p>
                  </div>
                  <span className="text-[10px] bg-zinc-800 border border-zinc-700 text-zinc-400 px-2 py-0.5 rounded-full font-bold">Salió</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
