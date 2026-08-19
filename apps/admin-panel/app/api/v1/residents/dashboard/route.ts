import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withResidente } from '@/lib/residenteAuth';

export const GET = withResidente(async ({ user }) => {
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
});
