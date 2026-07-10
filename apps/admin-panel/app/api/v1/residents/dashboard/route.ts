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

    // 2. Consultar vista_dashboard_residente para el user_id
    const { data: dashboard, error } = await supabaseAdmin
      .from('vista_dashboard_residente')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error al consultar vista_dashboard_residente:', error);
      return NextResponse.json({ error: 'Error interno del servidor al consultar el dashboard' }, { status: 500 });
    }

    return NextResponse.json({ data: dashboard || null });
  } catch (error: any) {
    console.error('Error en API dashboard:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
