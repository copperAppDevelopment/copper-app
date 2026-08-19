import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withResidente } from '@/lib/residenteAuth';

export const GET = withResidente(async ({ residenteId }) => {
  const { data: indicators, error } = await supabaseAdmin
    .from('vista_mis_balances_indicadores')
    .select('*')
    .eq('residente_id', residenteId)
    .maybeSingle();

  if (error) {
    console.error('Error al consultar vista_mis_balances_indicadores:', error);
    return NextResponse.json({ error: 'Error interno del servidor al consultar los indicadores' }, { status: 500 });
  }

  return NextResponse.json({ data: indicators || null });
});
