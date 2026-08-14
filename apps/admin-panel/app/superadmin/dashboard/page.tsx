'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Users, CreditCard, LayoutDashboard, Settings, LogOut, CheckCircle2, TrendingUp, Building2 } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

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

      if (profile?.rol !== "SuperAdmin") {
        router.push("/");
        return;
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
              Dashboard
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-zinc-400 hover:text-white hover:bg-zinc-850 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              onClick={(e) => e.preventDefault()}
            >
              <Building2 className="w-5 h-5" />
              Conjuntos
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-zinc-400 hover:text-white hover:bg-zinc-850 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              onClick={(e) => e.preventDefault()}
            >
              <CreditCard className="w-5 h-5" />
              Planes y Pagos
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-zinc-400 hover:text-white hover:bg-zinc-850 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              onClick={(e) => e.preventDefault()}
            >
              <Users className="w-5 h-5" />
              Usuarios
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-zinc-400 hover:text-white hover:bg-zinc-850 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              onClick={(e) => e.preventDefault()}
            >
              <Settings className="w-5 h-5" />
              Configuración
            </a>
          </nav>
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-zinc-800 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center border border-brand/35 text-brand font-bold text-xs">
              SA
            </div>
            <div className="truncate text-left">
              <p className="text-xs text-white font-semibold truncate">{userEmail}</p>
              <p className="text-[10px] text-zinc-500 font-mono">SUPERADMIN</p>
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
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Portal del SuperAdmin</h1>
            <p className="text-sm text-zinc-400">Consola de administración global de Copper App</p>
          </div>
          <span className="flex items-center gap-1.5 bg-brand/10 border border-brand/25 text-brand px-3 py-1.5 rounded-full text-xs font-semibold">
            <Shield className="w-4 h-4" />
            SuperAdmin Mode
          </span>
        </header>

        {/* Grid Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-2">
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Copropiedades</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold">4</span>
              <span className="text-emerald-500 text-xs font-bold">Activos</span>
            </div>
            <p className="text-[10px] text-zinc-500">Conjuntos residenciales vinculados</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-2">
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Suscripciones</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold">2</span>
              <span className="text-brand text-xs font-bold">Vigentes</span>
            </div>
            <p className="text-[10px] text-zinc-500">Planes activos facturándose</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-2">
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Recaudo Global</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold">$5&apos;250.000</span>
              <span className="text-zinc-500 text-xs font-bold">COP</span>
            </div>
            <p className="text-[10px] text-zinc-500">Ingresos mensuales aproximados</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-2">
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Rendimiento</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold">99.9%</span>
              <span className="text-emerald-500 text-xs font-bold">Uptime</span>
            </div>
            <p className="text-[10px] text-zinc-500">Servidores e integraciones estables</p>
          </div>
        </section>

        {/* Content sections */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions & Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl text-left space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-brand" />
                Operaciones Administrativas Globales
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-brand/40 transition-colors cursor-pointer">
                  <h3 className="font-semibold text-sm text-white">Crear Nuevo Conjunto</h3>
                  <p className="text-xs text-zinc-400 mt-1">Registra y asigna llaves API para un nuevo conjunto residencial.</p>
                </div>
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-brand/40 transition-colors cursor-pointer">
                  <h3 className="font-semibold text-sm text-white">Configurar Planes comerciales</h3>
                  <p className="text-xs text-zinc-400 mt-1">Modifica precios, beneficios y límites de residentes.</p>
                </div>
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-brand/40 transition-colors cursor-pointer">
                  <h3 className="font-semibold text-sm text-white">Auditoría de Actividad</h3>
                  <p className="text-xs text-zinc-400 mt-1">Revisa registros de auditoría y accesos al sistema en tiempo real.</p>
                </div>
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-brand/40 transition-colors cursor-pointer">
                  <h3 className="font-semibold text-sm text-white">Soporte Técnico Especial</h3>
                  <p className="text-xs text-zinc-400 mt-1">Resuelve reportes y gestiona incidencias de administradores.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity sidebar */}
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl text-left space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand" />
                Suscripciones Recientes
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                  <div>
                    <p className="text-xs font-semibold text-white">El Sol (DEMO)</p>
                    <p className="text-[10px] text-zinc-500">Plan Básico - Activo</p>
                  </div>
                  <span className="text-xs font-bold text-zinc-300">$0 COP</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                  <div>
                    <p className="text-xs font-semibold text-white">Pinares del Norte</p>
                    <p className="text-[10px] text-zinc-500">Plan Profesional - Vigente</p>
                  </div>
                  <span className="text-xs font-bold text-zinc-300">$180.000 COP</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <p className="text-xs font-semibold text-white">Senderos Campestre</p>
                    <p className="text-[10px] text-zinc-500">Plan Premium - Pendiente</p>
                  </div>
                  <span className="text-xs font-bold text-amber-500">En espera</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
