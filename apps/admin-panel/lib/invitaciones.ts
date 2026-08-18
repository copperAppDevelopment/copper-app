import { supabaseAdmin } from './supabaseAdmin';

export interface InvitacionValida {
  id: string;
  conjunto_id: string;
  rol: string;
  email: string;
  nombres: string | null;
  apellidos: string | null;
  tipo_documento: string | null;
  numero_documento: string | null;
  telefono: string | null;
  apartamento_id: string | null;
  nombre_conjunto: string;
}

export type ResultadoInvitacion =
  | { ok: true; invitacion: InvitacionValida }
  | { ok: false; motivo: 'no_existe' | 'usada' | 'caducada' };

/**
 * Valida un token de invitación. Lo usan la ruta de consulta y la de aceptación, para que
 * las dos apliquen exactamente las mismas condiciones.
 */
export async function validarToken(token: string): Promise<ResultadoInvitacion> {
  const { data } = await supabaseAdmin
    .from('invitaciones')
    .select('id, conjunto_id, rol, email, nombres, apellidos, tipo_documento, numero_documento, telefono, apartamento_id, usado, expira_en, conjuntos(nombre)')
    .eq('token', token)
    .maybeSingle();

  if (!data) return { ok: false, motivo: 'no_existe' };
  if (data.usado) return { ok: false, motivo: 'usada' };
  if (new Date(data.expira_en) < new Date()) return { ok: false, motivo: 'caducada' };

  const { usado, expira_en, conjuntos, ...resto } = data as any;

  return {
    ok: true,
    invitacion: { ...resto, nombre_conjunto: conjuntos?.nombre ?? 'tu conjunto' },
  };
}

export const MOTIVOS: Record<'no_existe' | 'usada' | 'caducada', string> = {
  no_existe: 'Esta invitación no existe o el enlace está incompleto.',
  usada: 'Esta invitación ya se utilizó. Inicia sesión con tu correo.',
  caducada: 'Esta invitación caducó. Pide al administrador que te envíe una nueva.',
};
