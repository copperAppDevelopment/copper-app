import { supabaseAdmin } from './supabaseAdmin';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || 'https://javsddqiuzzigbhygrtp.supabase.co';

export const BUCKET_BALANCES = 'balances';

/** Duración de la URL firmada que se le pasa a la edge function. */
const SIGNED_URL_TTL = 3600;

export interface DetalleCarga {
  tipo?: 'validacion' | 'apartamento' | 'duplicado' | 'insercion' | 'aplicacion';
  linea: string;
  referencia_1?: string;
  recaudo_id?: string;
  error: string;
}

export interface ResultadoProcesamiento {
  status: string;
  procesadas: number;
  insertados: number;
  duplicados?: number;
  errores: number;
  detalles: DetalleCarga[];
}

/**
 * Invoca la edge function `procesar_balances` sobre un archivo ya presente en el bucket.
 *
 * El bucket es privado, así que se genera una URL firmada: la función hace `fetch()` sin
 * cabeceras y una URL firmada le sirve igual que la pública que usaba antes, sin necesidad
 * de cambiar su contrato de entrada.
 *
 * Desde la v28 la función exige el token del administrador —ya no basta la anon key— y
 * verifica su pertenencia al conjunto por su cuenta.
 */
export async function procesarArchivo(params: {
  archivoPath: string;
  conjuntoId: string;
  periodo: string;
  accessToken: string;
}): Promise<ResultadoProcesamiento> {
  const { archivoPath, conjuntoId, periodo, accessToken } = params;

  const { data: firmada, error: errorFirma } = await supabaseAdmin.storage
    .from(BUCKET_BALANCES)
    .createSignedUrl(archivoPath, SIGNED_URL_TTL);

  if (errorFirma || !firmada?.signedUrl) {
    throw new Error('No se pudo generar el acceso temporal al archivo.');
  }

  const res = await fetch(`${SUPABASE_URL}/functions/v1/procesar_balances`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      file_url: firmada.signedUrl,
      conjunto_id: conjuntoId,
      mes: periodo,
    }),
  });

  const texto = await res.text();
  let payload: any = {};
  try {
    payload = texto ? JSON.parse(texto) : {};
  } catch {
    payload = { message: texto };
  }

  if (!res.ok) {
    throw new Error(payload.message || payload.error || 'No se pudo procesar el archivo.');
  }

  return {
    status: payload.status ?? 'ok',
    procesadas: payload.procesadas ?? 0,
    insertados: payload.insertados ?? 0,
    duplicados: payload.duplicados ?? 0,
    errores: payload.errores ?? 0,
    detalles: Array.isArray(payload.detalles) ? payload.detalles : [],
  };
}

/** Registra el resultado en `cargas_recaudos` para que sobreviva al refresco. */
export async function registrarCarga(params: {
  conjuntoId: string;
  archivoPath: string;
  archivoNombre: string | null;
  periodo: string;
  creadoPor: string;
  resultado: ResultadoProcesamiento;
}) {
  const { conjuntoId, archivoPath, archivoNombre, periodo, creadoPor, resultado } = params;

  const { data, error } = await supabaseAdmin
    .from('cargas_recaudos')
    .insert({
      conjunto_id: conjuntoId,
      archivo_path: archivoPath,
      archivo_nombre: archivoNombre,
      periodo,
      procesadas: resultado.procesadas,
      insertados: resultado.insertados,
      errores: resultado.errores,
      detalles: resultado.detalles as any,
      creado_por: creadoPor,
    })
    .select()
    .single();

  if (error) {
    console.error('Error al registrar la carga de recaudos:', error);
    return null;
  }

  return data;
}
