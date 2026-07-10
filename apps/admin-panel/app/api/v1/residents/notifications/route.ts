import { NextResponse } from 'next/server';
import { getAuthUser } from '../../../../../lib/auth';
import { supabaseAdmin } from '../../../../../lib/supabaseAdmin';

export async function GET(req: Request) {
  try {
    // 1. Validar autenticación
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // 2. Consultar vista_notificaciones_residente filtrando por destinatarios (userIds es null o contiene el user.id)
    const { data: notifications, error } = await supabaseAdmin
      .from('vista_notificaciones_residente')
      .select('*')
      .or(`userIds.is.null,userIds.cs.{"${user.id}"}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al consultar vista_notificaciones_residente:', error);
      return NextResponse.json({ error: 'Error interno del servidor al consultar notificaciones' }, { status: 500 });
    }

    return NextResponse.json({ data: notifications || [] });
  } catch (error: any) {
    console.error('Error en API notifications:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
