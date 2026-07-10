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

    // 2. Obtener el residente_id
    const { data: residente, error: residenteError } = await supabaseAdmin
      .from('residentes')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (residenteError || !residente) {
      console.error('Error al obtener perfil de residente:', residenteError);
      return NextResponse.json({ error: 'No se encontró perfil de residente para el usuario' }, { status: 404 });
    }

    // 3. Consultar vista_mis_balances_indicadores para el residente_id
    const { data: indicators, error } = await supabaseAdmin
      .from('vista_mis_balances_indicadores')
      .select('*')
      .eq('residente_id', residente.id)
      .maybeSingle();

    if (error) {
      console.error('Error al consultar vista_mis_balances_indicadores:', error);
      return NextResponse.json({ error: 'Error interno del servidor al consultar los indicadores' }, { status: 500 });
    }

    return NextResponse.json({ data: indicators || null });
  } catch (error: any) {
    console.error('Error en API balances/indicators:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
