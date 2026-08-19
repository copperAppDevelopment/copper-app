import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withResidente } from '@/lib/residenteAuth';

export const GET = withResidente(async ({ residenteId }, req) => {
  const { searchParams } = new URL(req.url);
  const sortBy = searchParams.get('sortBy') || 'recent'; // 'recent' u 'oldest'
  const type = searchParams.get('type') || 'all'; // 'all', 'PAGO' o 'CARGO'

  let query = supabaseAdmin
    .from('vista_mis_balances_historial2')
    .select('*')
    .eq('residente_id', residenteId);

  if (type && type !== 'all') {
    query = query.eq('movimiento_tipo', type);
  }

  query = query.order('fecha_movimiento', { ascending: sortBy === 'oldest' });

  const { data: history, error } = await query;

  if (error) {
    console.error('Error al consultar vista_mis_balances_historial2:', error);
    return NextResponse.json({ error: 'Error interno del servidor al consultar el historial' }, { status: 500 });
  }

  return NextResponse.json({ data: history || [] });
});
