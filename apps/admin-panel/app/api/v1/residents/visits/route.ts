import { NextResponse } from 'next/server';
import { getAuthUser } from '../../../../../lib/auth';
import { supabaseAdmin } from '../../../../../lib/supabaseAdmin';

export async function PATCH(req: Request) {
  try {
    // 1. Validar autenticación del residente
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // 2. Extraer cuerpo
    const body = await req.json();
    const { visitaId, estado } = body;

    if (!visitaId || !estado) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos (visitaId o estado)' }, { status: 400 });
    }

    if (estado !== 'aprobado' && estado !== 'rechazado') {
      return NextResponse.json({ error: 'Estado de visita inválido (debe ser aprobado o rechazado)' }, { status: 400 });
    }

    // 3. Actualizar el registro en la tabla visitas
    const { error } = await supabaseAdmin
      .from('visitas')
      .update({
        estado_autorizacion: estado,
        autorizado_por: user.id,
        fecha_autorizacion: new Date().toISOString(),
      })
      .eq('id', visitaId);

    if (error) {
      console.error('Error al actualizar estado de visita:', error);
      return NextResponse.json({ error: 'Error interno del servidor al actualizar la visita' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Visita ${estado} con éxito.` });
  } catch (error: any) {
    console.error('Error en API visits:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
