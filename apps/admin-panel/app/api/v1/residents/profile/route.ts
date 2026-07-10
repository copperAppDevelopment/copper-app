import { NextResponse } from 'next/server';
import { getAuthUser } from '../../../../../lib/auth';
import { supabaseAdmin } from '../../../../../lib/supabaseAdmin';

// 1. GET: Retorna los datos de perfil y todas las subtablas vinculadas
export async function GET(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener residente
    const { data: residente, error: residenteError } = await supabaseAdmin
      .from('residentes')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (residenteError || !residente) {
      console.error('Error al obtener residente:', residenteError);
      return NextResponse.json({ error: 'Perfil de residente no encontrado' }, { status: 404 });
    }

    // Consultas paralelas de subtablas
    const [
      { data: profileUser, error: userError },
      { data: dashboard },
      { data: convivientes },
      { data: vehiculos },
      { data: mascotas },
      { data: empleados },
    ] = await Promise.all([
      supabaseAdmin.from('users').select('*').eq('id', user.id).maybeSingle(),
      supabaseAdmin.from('vista_dashboard_residente').select('*').eq('user_id', user.id).maybeSingle(),
      supabaseAdmin.from('convivientes').select('*').eq('residente_id', residente.id),
      supabaseAdmin.from('vehiculos').select('*').eq('residente_id', residente.id),
      supabaseAdmin.from('mascotas').select('*').eq('residente_id', residente.id),
      supabaseAdmin.from('empleados_servicio').select('*').eq('residente_id', residente.id),
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
  } catch (error: any) {
    console.error('Error en GET profile:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}

// 2. PATCH: Actualiza los datos básicos del perfil (tabla users)
export async function PATCH(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { nombres, apellidos, phone_number, tipo_documento, cedula } = body;

    // Validación básica
    if (!nombres || !apellidos || !tipo_documento || !cedula) {
      return NextResponse.json({ error: 'Faltan campos requeridos (nombres, apellidos, tipo_documento o cedula)' }, { status: 400 });
    }

    // Actualizar tabla public.users
    const { data: updatedUser, error } = await supabaseAdmin
      .from('users')
      .update({
        nombres,
        apellidos,
        phone_number: phone_number || null,
        tipo_documento,
        cedula,
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar perfil de usuario:', error);
      return NextResponse.json({ error: 'Error interno al actualizar datos del perfil' }, { status: 500 });
    }

    return NextResponse.json({ data: updatedUser });
  } catch (error: any) {
    console.error('Error en PATCH profile:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
