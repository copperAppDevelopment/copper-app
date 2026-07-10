import { NextResponse } from 'next/server';
import { getAuthUser } from '../../../../../../lib/auth';
import { supabaseAdmin } from '../../../../../../lib/supabaseAdmin';

export async function GET(req: Request) {
  try {
    // 1. Validar autenticación
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // 2. Extraer query parameters
    const { searchParams } = new URL(req.url);
    const sortBy = searchParams.get('sortBy') || 'recent'; // 'recent' o 'oldest'
    const type = searchParams.get('type') || 'all'; // 'all', 'PAGO', o 'CARGO'

    // 3. Obtener el residente_id
    const { data: residente, error: residenteError } = await supabaseAdmin
      .from('residentes')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (residenteError || !residente) {
      console.error('Error al obtener perfil de residente:', residenteError);
      return NextResponse.json({ error: 'No se encontró perfil de residente para el usuario' }, { status: 404 });
    }

    // 4. Consultar vista_mis_balances_historial2 para el residente_id
    let query = supabaseAdmin
      .from('vista_mis_balances_historial2')
      .select('*')
      .eq('residente_id', residente.id);

    // Filtro por tipo de movimiento (PAGO o CARGO)
    if (type && type !== 'all') {
      query = query.eq('movimiento_tipo', type);
    }

    // Ordenamiento por fecha
    const ascending = sortBy === 'oldest';
    query = query.order('fecha_movimiento', { ascending });

    const { data: history, error } = await query;

    if (error) {
      console.error('Error al consultar vista_mis_balances_historial2:', error);
      return NextResponse.json({ error: 'Error interno del servidor al consultar el historial' }, { status: 500 });
    }

    return NextResponse.json({ data: history || [] });
  } catch (error: any) {
    console.error('Error en API balances/history:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
