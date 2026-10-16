import { supabaseAdmin } from './supabaseAdmin';
import { ErrorHttp } from './apiHandler';
import { URL_PANEL } from './tiendas';
import { asuntoInvitacion, htmlInvitacion, textoInvitacion } from './correos/plantillaInvitacion';

/**
 * Crear, reprogramar y enviar invitaciones desde el servidor del panel.
 *
 * Antes lo hacía la edge function `invite-user`, que no comprobaba quién la llamaba (bastaba la
 * anon key de la app) y armaba el enlace contra la landing, donde la página no existe. Aquí solo
 * llegan rutas que ya pasaron por `withAdminConjunto`.
 */

const REMITENTE = 'Copper <no-reply@copperapp.co>';
/** Lo máximo que acepta la API de lotes de Resend por llamada. */
const LOTE_RESEND = 100;

export interface NuevaInvitacion {
  conjuntoId: string;
  rol: string;
  email: string;
  telefono?: string | null;
  apartamentoId?: string | null;
  /** Solo para el equipo: el residente los llena al crear su cuenta. */
  nombres?: string | null;
  apellidos?: string | null;
  tipoDocumento?: string | null;
  numeroDocumento?: string | null;
}

export interface ResultadoEnvio {
  enviadas: number;
  fallidas: { email: string; error: string }[];
}

/** El apartamento tiene que ser del conjunto: es lo que impide invitar a otro conjunto. */
async function validarApartamento(apartamentoId: string, conjuntoId: string) {
  const { data } = await supabaseAdmin
    .from('apartamentos')
    .select('id')
    .eq('id', apartamentoId)
    .eq('conjunto_id', conjuntoId)
    .maybeSingle();
  if (!data) throw new ErrorHttp('El apartamento no pertenece a este conjunto', 400);
}

/** Inserta las invitaciones y devuelve sus ids, en el mismo orden. */
export async function crearInvitaciones(nuevas: NuevaInvitacion[]): Promise<string[]> {
  if (nuevas.length === 0) return [];

  const filas = nuevas.map(n => {
    const esResidente = n.rol === 'Residente';
    return {
      conjunto_id: n.conjuntoId,
      rol: n.rol,
      email: n.email.trim().toLowerCase(),
      telefono: n.telefono || null,
      apartamento_id: esResidente ? (n.apartamentoId || null) : null,
      nombres: esResidente ? null : n.nombres ?? null,
      apellidos: esResidente ? null : n.apellidos ?? null,
      tipo_documento: esResidente ? null : n.tipoDocumento ?? null,
      numero_documento: esResidente ? null : n.numeroDocumento ?? null,
      token: crypto.randomUUID(),
    };
  });

  const { data, error } = await supabaseAdmin.from('invitaciones').insert(filas).select('id');
  if (error || !data) {
    console.error('Error al crear invitaciones:', error);
    throw new ErrorHttp('No se pudieron crear las invitaciones', 500);
  }
  return data.map(f => f.id);
}

/** Una sola invitación, validando el apartamento. Para los formularios individuales. */
export async function crearInvitacion(nueva: NuevaInvitacion): Promise<string> {
  if (nueva.apartamentoId) await validarApartamento(nueva.apartamentoId, nueva.conjuntoId);
  const [id] = await crearInvitaciones([nueva]);
  return id!;
}

/** Mismo token, siete días más y un envío más. Ignora las aceptadas y las de otro conjunto. */
export async function reprogramarInvitaciones(ids: string[], conjuntoId: string): Promise<string[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabaseAdmin.rpc('reprogramar_invitaciones', {
    p_ids: ids,
    p_conjunto_id: conjuntoId,
  });
  if (error) {
    console.error('Error al reprogramar invitaciones:', error);
    throw new ErrorHttp('No se pudieron reprogramar las invitaciones', 500);
  }
  return (data ?? []) as string[];
}

/**
 * Envía el correo de cada invitación, en lotes, y deja anotado en la fila si salió o qué
 * respondió Resend. Un lote fallido no detiene los siguientes.
 */
export async function enviarInvitaciones(ids: string[]): Promise<ResultadoEnvio> {
  const resultado: ResultadoEnvio = { enviadas: 0, fallidas: [] };
  if (ids.length === 0) return resultado;

  const clave = process.env.RESEND_API_KEY;
  if (!clave) throw new ErrorHttp('Falta configurar RESEND_API_KEY en el servidor', 500);

  const { data: filas, error } = await supabaseAdmin
    .from('invitaciones')
    .select('id, email, rol, token, expira_en, conjuntos(nombre), apartamentos(numero_apartamento)')
    .in('id', ids);

  if (error || !filas) {
    console.error('Error al leer las invitaciones a enviar:', error);
    throw new ErrorHttp('No se pudieron leer las invitaciones', 500);
  }

  for (let i = 0; i < filas.length; i += LOTE_RESEND) {
    const lote = filas.slice(i, i + LOTE_RESEND) as any[];

    const correos = lote.map(f => {
      const datos = {
        nombreConjunto: f.conjuntos?.nombre ?? 'tu conjunto',
        rol: f.rol,
        enlace: `${URL_PANEL}/aceptarInvitacion?token=${f.token}`,
        numeroApartamento: f.apartamentos?.numero_apartamento ?? null,
        expiraEn: f.expira_en,
      };
      return {
        from: REMITENTE,
        to: [f.email],
        subject: asuntoInvitacion(datos),
        html: htmlInvitacion(datos),
        text: textoInvitacion(datos),
      };
    });

    let falla: string | null = null;
    try {
      const res = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: { Authorization: `Bearer ${clave}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(correos),
      });
      if (!res.ok) falla = (await res.text()).slice(0, 500) || `Resend respondió ${res.status}`;
    } catch (e: any) {
      falla = e?.message || 'No se pudo contactar a Resend';
    }

    const idsLote = lote.map(f => f.id);
    await supabaseAdmin
      .from('invitaciones')
      .update(falla ? { error_envio: falla } : { error_envio: null, ultimo_envio_en: new Date().toISOString() })
      .in('id', idsLote);

    if (falla) {
      console.error('Resend rechazó un lote de invitaciones:', falla);
      resultado.fallidas.push(...lote.map(f => ({ email: f.email, error: falla! })));
    } else {
      resultado.enviadas += lote.length;
    }
  }

  return resultado;
}
