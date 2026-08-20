import type { DatosRegistro } from "./types";

/**
 * Alta de la cuenta.
 *
 * No usa `postConAuth`: todavía no hay sesión que adjuntar. Es la única llamada del panel que
 * sale sin token.
 */
export async function registrarAdmin(datos: DatosRegistro): Promise<{ user_id: string }> {
  const res = await fetch("/api/v1/auth/registro-admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombres: datos.nombres,
      apellidos: datos.apellidos,
      tipo_documento: datos.tipo_documento,
      documento: datos.documento,
      telefono: datos.telefono,
      email: datos.email,
      contrasena: datos.contrasena,
      website: datos.website,
    }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || "No se pudo crear la cuenta.");
  return json;
}
