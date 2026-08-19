import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withResidente } from '@/lib/residenteAuth';

export const GET = withResidente(async ({ user }) => {
  const { data: balances, error } = await supabaseAdmin
    .from('vista_saldos_por_concepto_residente')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error al consultar vista_saldos_por_concepto_residente:', error);
    return NextResponse.json({ error: 'Error interno del servidor al consultar saldos' }, { status: 500 });
  }

  return NextResponse.json({ data: balances || [] });
});
