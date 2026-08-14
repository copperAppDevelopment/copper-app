import { supabase } from "./supabaseClient";

/**
 * Cliente de las rutas propias del panel (`/api/v1/admin/...`).
 *
 * El panel usa supabase-js, cuya sesión vive en el navegador: no hay cookie que el
 * servidor pueda leer, así que `lib/auth.ts` espera el token en `Authorization: Bearer`
 * y hay que adjuntarlo a mano en cada llamada.
 */

async function tokenActual(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? "";
}

async function desempaquetar(res: Response) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.error || "No se pudo completar la operación.");
  }
  return json;
}

export async function postConAuth<T = any>(url: string, payload: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await tokenActual()}`,
    },
    body: JSON.stringify(payload),
  });
  return desempaquetar(res);
}

/** Para `multipart/form-data`: no se fija Content-Type, lo pone el navegador con su boundary. */
export async function postFormConAuth<T = any>(url: string, form: FormData): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${await tokenActual()}` },
    body: form,
  });
  return desempaquetar(res);
}
