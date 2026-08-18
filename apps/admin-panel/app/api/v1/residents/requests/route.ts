import { NextResponse } from 'next/server';
import { getAuthUser } from '../../../../../lib/auth';
import { supabaseAdmin } from '../../../../../lib/supabaseAdmin';
import { esTipo, TIPOS } from '../../../../../lib/solicitudes';

// 1. GET: Obtiene las solicitudes del residente
export async function GET(req: Request) {
  try {
    // Validar autenticación
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener el residente_id
    const { data: residente, error: residenteError } = await supabaseAdmin
      .from('residentes')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (residenteError || !residente) {
      console.error('Error al obtener perfil de residente:', residenteError);
      return NextResponse.json({ error: 'No se encontró perfil de residente para el usuario' }, { status: 404 });
    }

    // Consultar vista_mis_solicitudes para el residente_id
    const { data: requests, error } = await supabaseAdmin
      .from('vista_mis_solicitudes')
      .select('*')
      .eq('residente_id', residente.id)
      .order('fecha_solicitud', { ascending: false });

    if (error) {
      console.error('Error al consultar vista_mis_solicitudes:', error);
      return NextResponse.json({ error: 'Error interno del servidor al consultar solicitudes' }, { status: 500 });
    }

    return NextResponse.json({ data: requests || [] });
  } catch (error: any) {
    console.error('Error en GET requests:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}

// 2. POST: Radica una nueva solicitud
export async function POST(req: Request) {
  try {
    // Validar autenticación
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener perfil de residente (id y conjunto_id)
    const { data: residente, error: residenteError } = await supabaseAdmin
      .from('residentes')
      .select('id, conjunto_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (residenteError || !residente) {
      console.error('Error al obtener perfil de residente:', residenteError);
      return NextResponse.json({ error: 'No se encontró perfil de residente para el usuario' }, { status: 404 });
    }

    // Extraer datos del body
    const body = await req.json();
    const { titulo_solicitud, descripcion, solicitud_tipo, ubicacion } = body;

    if (!titulo_solicitud || !descripcion || !solicitud_tipo) {
      return NextResponse.json({ error: 'Faltan campos requeridos (titulo_solicitud, descripcion o solicitud_tipo)' }, { status: 400 });
    }

    // `solicitud_tipo` es un enum en la base: sin esta validación un valor desconocido
    // se iría en un 500 por error 22P02 en vez de un mensaje útil.
    if (!esTipo(String(solicitud_tipo))) {
      return NextResponse.json(
        { error: `El tipo de solicitud no es válido. Opciones: ${TIPOS.join(', ')}` },
        { status: 400 }
      );
    }

    // Insertar en la tabla solicitudes
    const { data: newRequest, error } = await supabaseAdmin
      .from('solicitudes')
      .insert({
        titulo_solicitud,
        descripcion,
        solicitud_tipo,
        ubicacion: ubicacion || null,
        residente_id: residente.id,
        conjunto_id: residente.conjunto_id,
        solicitud_estado: 'pendientes',
        fecha_solicitud: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error al insertar solicitud:', error);
      return NextResponse.json({ error: 'Error interno al registrar la solicitud' }, { status: 500 });
    }

    return NextResponse.json({ data: newRequest }, { status: 201 });
  } catch (error: any) {
    console.error('Error en POST requests:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
