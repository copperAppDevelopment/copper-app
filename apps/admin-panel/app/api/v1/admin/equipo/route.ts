import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, okCon, fail } from '@/lib/apiHandler';
import { esRolEquipo } from '@/lib/equipo';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || 'https://javsddqiuzzigbhygrtp.supabase.co';
const SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * POST: Invitar a alguien al equipo del conjunto.
 *
 * Mismo patrón de dos caminos que `residentes/invitar`, que existe porque la edge function
 * `invite-user` no consulta `users` y trata igual un correo nuevo que uno ya registrado:
 *
 *  - Correo desconocido  → invitación normal (edge function + correo con token).
 *  - Correo ya registrado → no se invita; se devuelve el usuario para que la UI ofrezca
 *    vincularlo directamente al conjunto con `/equipo/vincular`.
 */
export const POST = withAdminConjunto(async ({ conjuntoId, body }) => {
  const { email, rol, nombres, apellidos, tipo_documento, numero_documento, telefono } = body;

  const correo = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!correo) {
    return fail('El correo es obligatorio', 400);
  }

  if (!esRolEquipo(String(rol))) {
    return fail('El rol no es válido', 400);
  }

  // `invite-user` exige estos datos para todo lo que no sea Residente.
  if (!nombres || !apellidos || !tipo_documento || !numero_documento) {
    return fail('Nombres, apellidos, tipo y número de documento son obligatorios', 400);
  }

  // `users.email` no es único, así que puede haber varias filas.
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
    const { data: miembro } = await supabaseAdmin
      .from('admins_conjuntos')
      .select('id, activo, es_propietario')
      .eq('user_id', existente.id)
      .eq('conjunto_id', conjuntoId)
      .maybeSingle();

    if (miembro?.activo) {
      return fail('Esta persona ya forma parte del equipo de este conjunto.', 409);
    }

    return ok({ yaRegistrado: true, usuario: existente, miembroExistente: miembro ?? null });
  }

  const res = await fetch(`${SUPABASE_URL}/functions/v1/invite-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      conjunto_id: conjuntoId,
      rol,
      email: correo,
      nombres,
      apellidos,
      tipo_documento,
      numero_documento,
      telefono: telefono || null,
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
