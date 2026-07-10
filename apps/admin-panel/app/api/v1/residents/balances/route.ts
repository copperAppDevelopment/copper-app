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

    // 2. Consultar saldos por concepto para el user_id
    const { data: balances, error } = await supabaseAdmin
      .from('vista_saldos_por_concepto_residente')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error al consultar vista_saldos_por_concepto_residente:', error);
      return NextResponse.json({ error: 'Error interno del servidor al consultar saldos' }, { status: 500 });
    }

    return NextResponse.json({ data: balances || [] });
  } catch (error: any) {
    console.error('Error en API balances:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
