import { supabase } from "@/lib/supabaseClient";
import { postFormConAuth } from "@/lib/apiClient";
import type { Perfil, DatosPerfil } from "./types";

/**
 * Se lee de `users` y no de `vista_perfil_administracion` porque esa vista devuelve una
 * fila por conjunto: un admin de varios conjuntos aparecería repetido. El perfil es del
 * usuario, no del conjunto.
 */
export async function obtenerPerfil(userId: string): Promise<Perfil | null> {
  const { data, error } = await supabase
    .from("users")
    .select("id, nombres, apellidos, email, tipo_documento, documento, phone_number, direccion, foto_url, rol, created_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return (data as Perfil) || null;
}

export function guardarPerfil(datos: DatosPerfil, foto: File | null) {
  const form = new FormData();
  Object.entries(datos).forEach(([campo, valor]) => form.append(campo, valor));
  if (foto) form.append("foto", foto);
  return postFormConAuth("/api/v1/admin/perfil", form);
}
