import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withResidente } from '@/lib/residenteAuth';
import { esTipo, TIPOS } from '@/lib/solicitudes';

// 1. GET: Obtiene las solicitudes del residente
export const GET = withResidente(async ({ residenteId }) => {
  const { data: requests, error } = await supabaseAdmin
    .from('vista_mis_solicitudes')
    .select('*')
    .eq('residente_id', residenteId)
    .order('fecha_solicitud', { ascending: false });

  if (error) {
    console.error('Error al consultar vista_mis_solicitudes:', error);
    return NextResponse.json({ error: 'Error interno del servidor al consultar solicitudes' }, { status: 500 });
  }

  return NextResponse.json({ data: requests || [] });
});

// 2. POST: Radica una nueva solicitud
export const POST = withResidente(async ({ residenteId, conjuntoId }, req) => {
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

  const { data: newRequest, error } = await supabaseAdmin
    .from('solicitudes')
    .insert({
      titulo_solicitud,
      descripcion,
      solicitud_tipo,
      ubicacion: ubicacion || null,
      residente_id: residenteId,
      conjunto_id: conjuntoId,
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
});
