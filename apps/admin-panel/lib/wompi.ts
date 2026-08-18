import { createHash } from 'node:crypto';
import { ErrorHttp } from './apiHandler';

/**
 * Integración con Wompi, antes repartida entre las edge functions `create-wompi-payment`
 * y `wompi-webhook`.
 *
 * El motivo de traerla al panel es poder alternar sandbox y producción con variables de
 * entorno: en Supabase las llaves eran secretos de la función y cambiarlas obligaba a
 * redesplegar, así que no había forma de probar un cobro sin tocar producción.
 *
 * Solo se importa desde rutas de servidor: lee secretos y usa `node:crypto`.
 */

export interface ConfigWompi {
  publicKey: string;
  integritySecret: string;
  checkoutUrl: string;
  appBaseUrl: string;
}

/**
 * Lee la configuración y falla en el acto si falta algo. Sin esto, una llave vacía
 * produciría una firma válida en apariencia que Wompi rechaza al abrir el checkout, con
 * un error que no apunta a la causa.
 */
export function configWompi(): ConfigWompi {
  const config = {
    publicKey: process.env.WOMPI_PUBLIC_KEY ?? '',
    integritySecret: process.env.WOMPI_INTEGRITY_SECRET ?? '',
    checkoutUrl: process.env.WOMPI_CHECKOUT_URL || 'https://checkout.wompi.co/p/',
    appBaseUrl: process.env.APP_BASE_URL ?? '',
  };

  const faltantes = (
    [
      ['WOMPI_PUBLIC_KEY', config.publicKey],
      ['WOMPI_INTEGRITY_SECRET', config.integritySecret],
      ['APP_BASE_URL', config.appBaseUrl],
    ] as const
  )
    .filter(([, valor]) => !valor)
    .map(([nombre]) => nombre);

  if (faltantes.length) {
    throw new ErrorHttp(
      `Falta configurar la pasarela de pagos: ${faltantes.join(', ')}`,
      500
    );
  }

  return config;
}

/**
 * El secreto de eventos, lo único que necesita el webhook.
 *
 * Va aparte de `configWompi` a propósito: el webhook no arma ningún checkout, y exigirle
 * también las llaves públicas lo haría responder 500 —y a Wompi reintentar— por una
 * variable que no usa.
 */
export const secretoEventos = () => process.env.WOMPI_EVENTS_SECRET ?? '';

const sha256 = (texto: string) => createHash('sha256').update(texto, 'utf8').digest('hex');

/**
 * Firma de integridad del checkout: SHA-256 de referencia + monto + moneda + secreto,
 * en hexadecimal minúscula. Wompi rechaza el enlace si no coincide.
 */
export function firmaIntegridad(
  referencia: string,
  montoEnCentavos: number,
  moneda: string,
  secreto: string
): string {
  return sha256(`${referencia}${montoEnCentavos}${moneda}${secreto}`);
}

/** Recorre un `a.b.c` sobre el objeto del evento. */
function valorEnRuta(objeto: unknown, ruta: string): unknown {
  return ruta.split('.').reduce<any>((acc, clave) => acc?.[clave], objeto);
}

export interface EventoWompi {
  signature?: { properties?: string[]; checksum?: string };
  timestamp?: number | string;
  data?: { transaction?: Record<string, any> };
}

/**
 * Valida la firma del evento. El webhook es una ruta pública —Wompi no manda un token—,
 * así que esta comprobación es la única prueba de que el evento viene de la pasarela y
 * no de alguien que adivinó la URL.
 */
export function firmaEventoValida(evento: EventoWompi, secreto: string): boolean {
  const propiedades = evento?.signature?.properties;
  const checksum = evento?.signature?.checksum;

  if (!Array.isArray(propiedades) || !checksum || !evento.timestamp || !evento.data) {
    return false;
  }
  if (!secreto) return false;

  const concatenado =
    propiedades.map((prop) => String(valorEnRuta(evento.data, prop))).join('') +
    String(evento.timestamp) +
    secreto;

  const local = sha256(concatenado).toUpperCase();
  const remoto = checksum.toUpperCase();

  // Longitudes distintas ⇒ distinto, sin tocar `timingSafeEqual` con buffers desiguales.
  if (local.length !== remoto.length) return false;

  let diferencia = 0;
  for (let i = 0; i < local.length; i++) {
    diferencia |= local.charCodeAt(i) ^ remoto.charCodeAt(i);
  }
  return diferencia === 0;
}

/** La referencia con la que el webhook reencuentra el pago. Debe ser única. */
export const referenciaPago = (conjuntoId: string) =>
  `SUB-${conjuntoId}-${Date.now()}`;

export interface EnlaceCheckout {
  url: string;
  referencia: string;
  montoEnCentavos: number;
}

/** Arma la URL del checkout ya firmada. */
export function enlaceCheckout(
  config: ConfigWompi,
  referencia: string,
  monto: number
): EnlaceCheckout {
  const montoEnCentavos = Math.round(monto * 100);
  const url = new URL(config.checkoutUrl);

  url.searchParams.set('public-key', config.publicKey);
  url.searchParams.set('currency', 'COP');
  url.searchParams.set('amount-in-cents', String(montoEnCentavos));
  url.searchParams.set('reference', referencia);
  url.searchParams.set(
    'signature:integrity',
    firmaIntegridad(referencia, montoEnCentavos, 'COP', config.integritySecret)
  );
  // Wompi devuelve al usuario aquí con `?id=<transacción>`; la página de conjuntos lo
  // único que hace es recargar, porque quien decide es el webhook.
  url.searchParams.set('redirect-url', `${config.appBaseUrl}/admin/conjuntos`);

  return { url: url.toString(), referencia, montoEnCentavos };
}
