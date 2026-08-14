import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, okCon, fail } from '@/lib/apiHandler';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || 'https://javsddqiuzzigbhygrtp.supabase.co';
const SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * POST: Invitar a un residente.
 *
 * La edge function `invite-user` no consulta `users` en ningún momento: trata igual a un
 * email nuevo que a uno ya registrado, creando una invitación en ambos casos. La distinción
 * se hace aquí, antes de llamarla:
 *
 *  - Email desconocido  → invitación normal (edge function + correo con token).
 *  - Email ya registrado → no se invita. Se devuelve el usuario para que la UI ofrezca
 *    vincularlo directamente al conjunto (`/vincular`), sin depender del flujo de
 *    aceptación que vive fuera de este repositorio.
 */
export const POST = withAdminConjunto(async ({ conjuntoId, body }) => {
  const { email, telefono, apartamento_id } = body;

  const correo = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!correo) {
    return fail('El correo es obligatorio', 400);
  }

  // ¿El correo ya tiene cuenta? `users.email` no es único, así que puede haber varias filas.
  const { data: existentes, error: errorExistente } = await supabaseAdmin
    .from('users')
    .select('id, nombres, apellidos, email, rol')
    .ilike('email', correo);

  if (errorExistente) {
    console.error('Error al buscar el usuario por correo:', errorExistente);
    return fail('Error interno al validar el correo', 500);
  }

  const existente = existentes?.[0];

  if (existente) {
    // ¿Ya es residente de este conjunto?
    const { data: residente } = await supabaseAdmin
      .from('residentes')
      .select('id, activo, apartamento_id')
      .eq('user_id', existente.id)
      .eq('conjunto_id', conjuntoId)
      .maybeSingle();

    return ok({
      yaRegistrado: true,
      usuario: existente,
      residenteExistente: residente ?? null,
    });
  }

  // Correo desconocido: se delega en la edge function, que genera el token,
  // inserta en `invitaciones` y envía el correo por Resend.
  const res = await fetch(`${SUPABASE_URL}/functions/v1/invite-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      conjunto_id: conjuntoId,
      rol: 'Residente',
      email: correo,
      telefono: telefono || null,
      apartamento_id: apartamento_id || null,
    }),
  });

  // La función devuelve texto plano en los errores, sin Content-Type json.
  const texto = await res.text();
  let payload: any = {};
  try {
    payload = texto ? JSON.parse(texto) : {};
  } catch {
    payload = { error: texto };
  }

  if (!res.ok) {
    console.error('Error de invite-user:', res.status, texto);
    return fail(payload.error || 'No se pudo enviar la invitación', res.status);
  }

  return okCon(
    { data: { yaRegistrado: false }, message: payload.message || 'Invitación enviada correctamente' },
    201
  );
});
