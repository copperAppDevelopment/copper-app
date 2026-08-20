'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, LogOut, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { setConjuntoSeleccionado } from "../../lib/conjunto";

interface ConjuntoSeleccion {
  conjunto_id: string | null;
  nombre: string | null;
  foto_url: string | null;
  user_id: string | null;
}

export default function SelectConjuntoPage() {
  const router = useRouter();
  const [conjuntos, setConjuntos] = useState<ConjuntoSeleccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        // 1️⃣ Check authentication session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          router.push("/login");
          return;
        }

        const userId = session.user.id;

        // 2️⃣ Fetch user role
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('rol, estado')
          .eq('id', userId)
          .maybeSingle();

        if (profileError || !profile) {
          console.error("Error al cargar perfil:", profileError);
          setErrorMsg("Error al validar el perfil de usuario.");
          setLoading(false);
          return;
        }

        if (profile.estado === false) {
          setErrorMsg("Su cuenta se encuentra inactiva.");
          await supabase.auth.signOut();
          router.push("/login");
          return;
        }

        setUserRole(profile.rol);

        // 3️⃣ Fetch complexes from vista_mis_conjuntos_seleccion
        const { data: selectionList, error: listError } = await supabase
          .from('vista_mis_conjuntos_seleccion')
          // Sin este filtro la vista devuelve los conjuntos de TODA la base: no hay RLS.
          .select('*')
          .eq('user_id', session.user.id);

        if (listError) {
          console.error("Error al cargar conjuntos de selección:", listError);
          setErrorMsg("No se pudieron cargar sus conjuntos residenciales asociados.");
        } else {
          // Filter duplicates by conjunto_id to avoid console key warnings and duplicate UI cards
          const uniqueList = (selectionList || []).filter((item, idx, self) =>
            item.conjunto_id && self.findIndex(t => t.conjunto_id === item.conjunto_id) === idx
          );
          setConjuntos(uniqueList);
        }
      } catch (err) {
        console.error("Unexpected error in select-conjunto:", err);
        setErrorMsg("Ocurrió un error inesperado al cargar la información.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  const handleSelect = (conjunto: ConjuntoSeleccion) => {
    setConjuntoSeleccionado(conjunto);

    // Redirect to dashboard based on role
    if (userRole === 'Admin') router.push("/admin/dashboard");
    else if (userRole === 'Recepcion') router.push("/recepcion/dashboard");
    else if (userRole === 'Contador') router.push("/contador/dashboard");
    else if (userRole === 'SuperAdmin') router.push("/superadmin/dashboard");
    else router.push("/");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 text-brand animate-spin mb-4" />
        <p className="text-zinc-400 text-sm">Cargando copropiedades...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-zinc-900 dark:text-white flex flex-col justify-between p-6 md:p-12">
      {/* Top bar */}
      <div className="flex justify-between items-center max-w-6xl w-full mx-auto pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-copper.webp" alt="Copper Logo" className="h-8 object-contain" />
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white active:scale-95 text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Cerrar Sesión
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-6xl w-full mx-auto py-12 flex flex-col justify-center items-center">
        <div className="text-center space-y-3 mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Selecciona tu Copropiedad
          </h1>
          <p className="text-zinc-550 dark:text-zinc-400 text-sm max-w-md mx-auto">
            Elige el conjunto residencial que deseas gestionar el día de hoy
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-950/80 border border-red-900 text-red-200 text-sm font-semibold max-w-md text-center mb-8">
            {errorMsg}
          </div>
        )}

        {conjuntos.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-450 dark:text-zinc-500">
              <Home className="w-8 h-8" />
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">No tienes ningún conjunto residencial asignado.</p>
            <p className="text-zinc-500 dark:text-zinc-650 text-xs max-w-xs mx-auto">
              Si eres administrador, crea el tuyo. Si no, solicita la vinculación de tu usuario con
              administración o el SuperAdmin.
            </p>
            {/* Sin esto, quien se registra y no llega a crear su conjunto queda encerrado aquí:
                el resto del panel exige un conjunto seleccionado. */}
            <button
              onClick={() => router.push("/admin/conjuntos")}
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
            >
              Crear mi primer conjunto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
            {conjuntos.map((conjunto, index) => (
              <div
                key={`${conjunto.conjunto_id || 'null'}-${index}`}
                onClick={() => handleSelect(conjunto)}
                className="group relative bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 hover:border-brand/40 dark:hover:border-brand/40 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-brand/5 transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-64"
              >
                {/* Image Section */}
                <div className="h-40 w-full relative bg-zinc-950 flex items-center justify-center overflow-hidden border-b border-zinc-800">
                  {conjunto.foto_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={conjunto.foto_url}
                      alt={conjunto.nombre || "Conjunto"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src="/logo-copper.webp"
                      alt="Fallback Logo"
                      className="w-20 h-20 object-contain opacity-40 group-hover:opacity-60 transition-opacity duration-300"
                    />
                  )}
                  {/* Subtle brand overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Info Section */}
                <div className="flex-1 p-4 flex items-center justify-between">
                  <div className="text-left">
                    <h3 className="font-bold text-zinc-850 dark:text-white text-base group-hover:text-brand transition-colors line-clamp-1">
                      {conjunto.nombre}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-450 mt-0.5">
                      Haz clic para ingresar
                    </p>
                  </div>
                  <div className="bg-brand/10 border border-brand/20 text-brand p-2 rounded-full group-hover:bg-brand group-hover:text-white transition-all duration-300">
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-6xl w-full mx-auto text-center border-t border-zinc-200 dark:border-zinc-800 pt-6">
        <p className="text-xs text-zinc-500 dark:text-zinc-600 font-mono">
          Copper S.A.S © Colombia 2026
        </p>
      </div>
    </div>
  );
}
