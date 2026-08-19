'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { getConjuntoSeleccionado, setConjuntoSeleccionado, clearConjuntoSeleccionado } from "../lib/conjunto";

export default function AdminPageRouter() {
  const router = useRouter();
  const [loadingMsg, setLoadingMsg] = useState("Cargando portal...");

  useEffect(() => {
    async function checkAuthAndRedirect() {
      try {
        // 1️⃣ Check if user is logged in
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          router.push("/login");
          return;
        }

        setLoadingMsg("Verificando perfil y rol...");
        const userId = session.user.id;

        // 2️⃣ Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (profileError || !profile) {
          console.error("Error al obtener perfil:", profileError);
          await supabase.auth.signOut();
          router.push("/login");
          return;
        }

        // 3️⃣ Verify user status
        if (profile.estado === false) {
          await supabase.auth.signOut();
          router.push("/login");
          return;
        }

        const role = profile.rol;

        // 4️⃣ Direct role-based redirection
        if (role === "Residente") {
          router.push("/residente/no-access");
          return;
        }

        if (role === "SuperAdmin") {
          router.push("/superadmin/dashboard");
          return;
        }

        // For Admin, Contador, Recepcion: check multi-complex association
        setLoadingMsg("Verificando copropiedades...");
        const { data: userConjuntos, error: conjuntosError } = await supabase
          .from("vista_mis_conjuntos_seleccion")
          // Sin este filtro la vista devuelve los conjuntos de TODA la base: no hay RLS.
          .select("*")
          .eq("user_id", session.user.id);

        if (conjuntosError) {
          console.error("Error cargando conjuntos:", conjuntosError);
        }

        // Filter duplicates by conjunto_id to count unique complexes
        const uniqueConjuntos = (userConjuntos || []).filter((item, idx, self) =>
          item.conjunto_id && self.findIndex(t => t.conjunto_id === item.conjunto_id) === idx
        );
        const count = uniqueConjuntos.length;

        if (count === 0) {
          // No complex associated, send directly to dashboard
          if (role === "Admin") router.push("/admin/dashboard");
          else if (role === "Recepcion") router.push("/recepcion/dashboard");
          else if (role === "Contador") router.push("/contador/dashboard");
          else router.push("/login");
        } else if (count === 1 && uniqueConjuntos[0]) {
          // Exactly 1 complex, select it and redirect to dashboard
          const selectedConjunto = uniqueConjuntos[0];
          setConjuntoSeleccionado(selectedConjunto);

          if (role === "Admin") router.push("/admin/dashboard");
          else if (role === "Recepcion") router.push("/recepcion/dashboard");
          else if (role === "Contador") router.push("/contador/dashboard");
          else router.push("/login");
        } else {
          // Multiple complexes, check if one was already chosen and stored
          const savedConjuntoId = getConjuntoSeleccionado()?.id;

          if (savedConjuntoId && userConjuntos?.some(c => c.conjunto_id === savedConjuntoId)) {
            // Already chosen a valid one, go straight to dashboard
            if (role === "Admin") router.push("/admin/dashboard");
            else if (role === "Recepcion") router.push("/recepcion/dashboard");
            else if (role === "Contador") router.push("/contador/dashboard");
            else router.push("/login");
          } else {
            // Needs to select one
            clearConjuntoSeleccionado();
            router.push("/select-conjunto");
          }
        }
      } catch (err) {
        console.error("Unexpected error in routing:", err);
        router.push("/login");
      }
    }

    checkAuthAndRedirect();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 text-brand animate-spin mx-auto" />
        <p className="text-zinc-400 text-sm font-medium">{loadingMsg}</p>
      </div>
    </div>
  );
}
