import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withResidente } from '@/lib/residenteAuth';

// 1. GET: Retorna los datos de perfil y todas las subtablas vinculadas
export const GET = withResidente(async ({ user, residenteId }) => {
  const [
    { data: residente },
    { data: profileUser, error: userError },
    { data: dashboard },
    { data: convivientes },
    { data: vehiculos },
    { data: mascotas },
    { data: empleados },
  ] = await Promise.all([
    supabaseAdmin.from('residentes').select('*').eq('id', residenteId).maybeSingle(),
    supabaseAdmin.from('users').select('*').eq('id', user.id).maybeSingle(),
    supabaseAdmin.from('vista_dashboard_residente').select('*').eq('user_id', user.id).maybeSingle(),
    supabaseAdmin.from('convivientes').select('*').eq('residente_id', residenteId),
    supabaseAdmin.from('vehiculos').select('*').eq('residente_id', residenteId),
    supabaseAdmin.from('mascotas').select('*').eq('residente_id', residenteId),
    supabaseAdmin.from('empleados_servicio').select('*').eq('residente_id', residenteId),
  ]);

  if (userError) {
    console.error('Error al obtener usuario:', userError);
    return NextResponse.json({ error: 'Error al consultar datos de usuario' }, { status: 500 });
  }

  return NextResponse.json({
    data: {
      user: profileUser || null,
      residente,
      dashboard: dashboard || null,
      convivientes: convivientes || [],
      vehiculos: vehiculos || [],
      mascotas: mascotas || [],
      empleados: empleados || [],
    },
  });
});

// 2. PATCH: Actualiza los datos básicos del perfil (tabla users)
export const PATCH = withResidente(async ({ user }, req) => {
  const body = await req.json();
  const { nombres, apellidos, phone_number, tipo_documento } = body;

  // `cedula` se renombró a `documento`, pero la app publicada sigue mandando el nombre
  // viejo. Se aceptan los dos hasta que salga una build nueva.
  const documento = body.documento ?? body.cedula;

  if (!nombres || !apellidos || !tipo_documento || !documento) {
    return NextResponse.json({ error: 'Faltan campos requeridos (nombres, apellidos, tipo_documento o documento)' }, { status: 400 });
  }

  const { data: updatedUser, error } = await supabaseAdmin
    .from('users')
    .update({
      nombres,
      apellidos,
      phone_number: phone_number || null,
      tipo_documento,
      documento,
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar perfil de usuario:', error);
    return NextResponse.json({ error: 'Error interno al actualizar datos del perfil' }, { status: 500 });
  }

  return NextResponse.json({ data: updatedUser });
});
