import { supabaseAdmin } from './supabaseAdmin';
import { ErrorHttp } from './apiHandler';
import { MAX_LINEAS } from '@/features/invitaciones/types';
import type { LineaMasiva } from '@/features/invitaciones/types';

/**
 * Lee la lista que pega el administrador —una línea por residente, `correo` o
 * `correo, apartamento`— y decide qué hacer con cada una. No escribe nada: la usan tanto la
 * vista previa como el envío, que vuelve a clasificar en vez de fiarse de lo que mande el
 * navegador.
 */

export interface LineaClasificada extends LineaMasiva {
  apartamentoId: string | null;
  /** Para `reenviar`: la invitación pendiente que ya existía. */
  invitacionId: string | null;
}

const PATRON_CORREO = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/;
/** Consultas `ilike` por tanda: con 300 correos en una sola URL, PostgREST la rechaza. */
const TANDA = 50;

/** «026» y «26» son el mismo apartamento; «A101» y «a101» también. */
const claveApartamento = (numero: string) => {
  const limpio = numero.trim().toUpperCase();
  return /^\d+$/.test(limpio) ? String(Number(limpio)) : limpio;
};

/** Los correos que ya tienen cuenta. `users.email` no distingue mayúsculas de forma fiable. */
async function correosRegistrados(correos: string[]): Promise<Set<string>> {
  const registrados = new Set<string>();
  for (let i = 0; i < correos.length; i += TANDA) {
    const tanda = correos.slice(i, i + TANDA);
    const { data } = await supabaseAdmin
      .from('users')
      .select('email')
      .or(tanda.map(c => `email.ilike.${c}`).join(','));
    // `ilike` trata `_` como comodín: se confirma la coincidencia exacta aquí.
    for (const u of data ?? []) {
      const correo = (u.email ?? '').toLowerCase();
      if (tanda.includes(correo)) registrados.add(correo);
    }
  }
  return registrados;
}

export async function clasificarLineas(texto: string, conjuntoId: string): Promise<LineaClasificada[]> {
  const crudas = String(texto ?? '')
    .split(/\r?\n/)
    .map((t, i) => ({ texto: t.trim(), linea: i + 1 }))
    .filter(l => l.texto);

  if (crudas.length === 0) throw new ErrorHttp('Pega al menos un correo', 400);
  if (crudas.length > MAX_LINEAS) {
    throw new ErrorHttp(`Son ${crudas.length} líneas; el máximo por envío es ${MAX_LINEAS}`, 400);
  }

  const lineas = crudas.map(({ texto: t, linea }) => {
    const [correo = '', apto = ''] = t.split(/[,;\t]/).map(p => p.trim());
    return { linea, email: correo.toLowerCase(), apartamento: apto || null };
  });

  const validos = [...new Set(lineas.map(l => l.email).filter(c => PATRON_CORREO.test(c)))];

  const [{ data: apartamentos }, { data: pendientes }, registrados] = await Promise.all([
    supabaseAdmin.from('apartamentos').select('id, numero_apartamento').eq('conjunto_id', conjuntoId),
    supabaseAdmin
      .from('invitaciones')
      .select('id, email')
      .eq('conjunto_id', conjuntoId)
      .eq('rol', 'Residente')
      .eq('usado', false)
      .order('creado_en', { ascending: false }),
    correosRegistrados(validos),
  ]);

  const porNumero = new Map(
    (apartamentos ?? []).map(a => [claveApartamento(a.numero_apartamento ?? ''), a.id])
  );
  const invitacionPorCorreo = new Map<string, string>();
  for (const p of pendientes ?? []) {
    // La más reciente primero: si hay varias del mismo correo, se reenvía esa.
    const correo = p.email.toLowerCase();
    if (!invitacionPorCorreo.has(correo)) invitacionPorCorreo.set(correo, p.id);
  }

  const vistos = new Set<string>();

  return lineas.map((l): LineaClasificada => {
    const base = { ...l, apartamentoId: null, invitacionId: null };

    if (!PATRON_CORREO.test(l.email)) return { ...base, accion: 'correo_invalido' };
    if (vistos.has(l.email)) return { ...base, accion: 'repetido' };
    vistos.add(l.email);

    const apartamentoId = l.apartamento ? porNumero.get(claveApartamento(l.apartamento)) ?? null : null;
    if (l.apartamento && !apartamentoId) return { ...base, accion: 'apartamento_no_encontrado' };
    if (registrados.has(l.email)) return { ...base, accion: 'ya_tiene_cuenta' };

    const invitacionId = invitacionPorCorreo.get(l.email) ?? null;
    if (invitacionId) return { ...base, invitacionId, accion: 'reenviar' };

    return { ...base, apartamentoId, accion: 'invitar' };
  });
}

/** Lo que se devuelve al navegador: sin ids internos. */
export const paraCliente = (lineas: LineaClasificada[]): LineaMasiva[] =>
  lineas.map(({ linea, email, apartamento, accion }) => ({ linea, email, apartamento, accion }));
