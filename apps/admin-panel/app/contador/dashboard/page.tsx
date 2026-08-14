'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  TrendingUp, Landmark, LogOut, LayoutDashboard,
  RefreshCw, FileSpreadsheet, Plus, DollarSign, PieChart
} from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import { getConjuntoSeleccionado, clearConjuntoSeleccionado } from "../../../lib/conjunto";

export default function ContadorDashboard() {
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

      if (profile?.rol !== "Contador") {
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
              Contabilidad
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-zinc-400 hover:text-white hover:bg-zinc-850 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              onClick={(e) => e.preventDefault()}
            >
              <DollarSign className="w-5 h-5" />
              Recaudo y Abonos
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-zinc-400 hover:text-white hover:bg-zinc-850 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              onClick={(e) => e.preventDefault()}
            >
              <FileSpreadsheet className="w-5 h-5" />
              Facturación Mensual
            </a>
            <a
              href="#"
              className="flex items-center gap-3 text-zinc-400 hover:text-white hover:bg-zinc-850 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              onClick={(e) => e.preventDefault()}
            >
              <PieChart className="w-5 h-5" />
              Balances Financieros
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
              Cambiar Conjunto
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center border border-brand/35 text-brand font-bold text-xs">
              CO
            </div>
            <div className="truncate text-left">
              <p className="text-xs text-white font-semibold truncate">{userEmail}</p>
              <p className="text-[10px] text-zinc-500 font-mono">CONTADOR PÚBLICO</p>
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
            <p className="text-sm text-zinc-400">Portal del Contador Financiero y Control de Caja</p>
          </div>
          <span className="flex items-center gap-1.5 bg-brand/10 border border-brand/25 text-brand px-3 py-1.5 rounded-full text-xs font-semibold">
            <Landmark className="w-4 h-4" />
            Auditoría Abierta
          </span>
        </header>

        {/* Grid Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-2">
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Recaudo Logrado</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold">$14&apos;250.000</span>
              <span className="text-zinc-500 text-xs font-bold">COP</span>
            </div>
            <p className="text-[10px] text-zinc-500">Monto total pagado este mes</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-2">
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Cartera Pendiente</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold">$4&apos;200.000</span>
              <span className="text-brand text-xs font-bold">COP</span>
            </div>
            <p className="text-[10px] text-zinc-500">Administración pendiente de cobro</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-2">
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Tasa de Recaudo</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold">77.2%</span>
              <span className="text-emerald-500 text-xs font-bold">Cobrado</span>
            </div>
            <p className="text-[10px] text-zinc-500">Porcentaje de eficiencia en cobranza</p>
          </div>
        </section>

        {/* Content sections */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl text-left space-y-4">
              <h2 className="text-lg font-bold text-white">Operaciones Financieras</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-brand/40 transition-colors cursor-pointer flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-white">Registrar Abono Manual</h3>
                    <p className="text-xs text-zinc-400 mt-1">Ingresa consignaciones bancarias recibidas directamente.</p>
                  </div>
                  <Plus className="w-5 h-5 text-brand" />
                </div>
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-brand/40 transition-colors cursor-pointer flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-white">Generar Facturación del Periodo</h3>
                    <p className="text-xs text-zinc-400 mt-1">Calcula y envía cobros automáticos de administración.</p>
                  </div>
                  <Plus className="w-5 h-5 text-brand" />
                </div>
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-brand/40 transition-colors cursor-pointer flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-white">Registrar Gasto del Conjunto</h3>
                    <p className="text-xs text-zinc-400 mt-1">Crea registros de egresos, pagos a proveedores y obras.</p>
                  </div>
                  <Plus className="w-5 h-5 text-brand" />
                </div>
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-brand/40 transition-colors cursor-pointer flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-white">Descargar Balance General</h3>
                    <p className="text-xs text-zinc-400 mt-1">Genera y exporta reportes contables en Excel / PDF.</p>
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
                <TrendingUp className="w-5 h-5 text-brand" />
                Transacciones Recientes
              </h2>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                  <div>
                    <p className="text-xs font-semibold text-white">Abono - Apto 204-B</p>
                    <p className="text-[10px] text-zinc-500">Transferencia PSE</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-500">+$210.000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                  <div>
                    <p className="text-xs font-semibold text-white">Abono - Apto 501-A</p>
                    <p className="text-[10px] text-zinc-500">Consignación Bancolombia</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-500">+$180.000</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <p className="text-xs font-semibold text-white">Pago Proveedor Segurcol</p>
                    <p className="text-[10px] text-zinc-500">Factura de Vigilancia</p>
                  </div>
                  <span className="text-xs font-bold text-red-500">-$3&apos;400.000</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
