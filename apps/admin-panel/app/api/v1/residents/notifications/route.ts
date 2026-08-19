import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withResidente } from '@/lib/residenteAuth';

export const GET = withResidente(async ({ user }) => {
  // Las notificaciones sin destinatario (`userIds` nulo) son para todos.
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
});
