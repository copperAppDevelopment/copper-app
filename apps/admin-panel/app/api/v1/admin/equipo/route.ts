import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminConjunto, ok, okCon, fail } from '@/lib/apiHandler';
import { crearInvitacion, enviarInvitaciones } from '@/lib/invitacionesServidor';
import { esRolEquipo } from '@/lib/equipo';

/**
 * POST: Invitar a alguien al equipo del conjunto.
 *
 * Mismo patrón de dos caminos que `residentes/invitar`:
 *
 *  - Correo desconocido  → invitación normal (fila con token + correo, `lib/invitacionesServidor`).
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

  // El equipo no completa estos datos al aceptar: tienen que venir en la invitación.
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

  const invitacionId = await crearInvitacion({
    conjuntoId,
    rol,
    email: correo,
    telefono: telefono || null,
    nombres,
    apellidos,
    tipoDocumento: tipo_documento,
    numeroDocumento: numero_documento,
  });

  const { fallidas } = await enviarInvitaciones([invitacionId]);
  if (fallidas.length > 0) {
    return fail(
      'La invitación quedó creada, pero el correo no salió. Inténtalo de nuevo en unos minutos.',
      502
    );
  }

  return okCon({ data: { yaRegistrado: false }, message: 'Invitación enviada correctamente' }, 201);
});
