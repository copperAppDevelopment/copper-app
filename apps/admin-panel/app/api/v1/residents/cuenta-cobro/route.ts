import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withResidente } from '@/lib/residenteAuth';
import { PATRON_PERIODO } from '@/lib/conceptos';
import { construirCuentaCobro, SinDatosCuenta } from '@/lib/cuentaCobro';
import { renderCuentaCobro } from '@/components/pdf/CuentaCobroDocumento';

const BUCKET = 'cuentas_cobro';

/** Lo justo para abrirlo: el enlace no debería sobrevivir a la sesión que lo pidió. */
const VIGENCIA_ENLACE = 300;

/**
 * POST: genera la cuenta de cobro de un periodo y devuelve un enlace firmado.
 *
 * Devuelve un enlace y no el PDF en el cuerpo porque la app lo abre con `Linking.openURL`, el
 * mismo camino que ya usa el botón de pago. Así no hacen falta dependencias nativas nuevas
 * —`expo-print`, `expo-file-system`— que romperían Expo Go y obligarían a un development build.
 *
 * Y no se pasa el token en la URL: el enlace lo firma el servidor, y caduca solo.
 */
export const POST = withResidente(async ({ conjuntoId, apartamentoId }, req) => {
  const body = await req.json().catch(() => ({}));
  const periodo = String(body.periodo ?? '').trim();

  if (!PATRON_PERIODO.test(periodo)) {
    return Response.json({ error: 'El periodo debe tener el formato YYYY-MM' }, { status: 400 });
  }

  // Hay residentes activos sin apartamento asignado; para ellos no existe cuenta de cobro.
  if (!apartamentoId) {
    return Response.json(
      { error: 'Todavía no tienes un apartamento asignado. Comunícate con la administración.' },
      { status: 409 }
    );
  }

  let cuenta;
  try {
    cuenta = await construirCuentaCobro({ conjuntoId, apartamentoId, periodo });
  } catch (error) {
    if (error instanceof SinDatosCuenta) {
      return Response.json({ error: error.message }, { status: 404 });
    }
    throw error;
  }

  const pdf = await renderCuentaCobro(cuenta);
  const ruta = `${conjuntoId}/${apartamentoId}/${periodo}.pdf`;

  // `upsert`: volver a descargar el mismo mes reemplaza el archivo en vez de acumular copias.
  // El identificador es derivado, así que el contenido vuelve a ser el mismo documento.
  const { error: errorSubida } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(ruta, pdf, { contentType: 'application/pdf', upsert: true });

  if (errorSubida) {
    console.error('Error al guardar la cuenta de cobro:', errorSubida);
    return Response.json({ error: 'No se pudo generar la cuenta de cobro.' }, { status: 500 });
  }

  const { data: firmado, error: errorFirma } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUrl(ruta, VIGENCIA_ENLACE);

  if (errorFirma || !firmado?.signedUrl) {
    console.error('Error al firmar la cuenta de cobro:', errorFirma);
    return Response.json({ error: 'No se pudo generar el enlace de descarga.' }, { status: 500 });
  }

  return Response.json({
    data: {
      url: firmado.signedUrl,
      identificador: cuenta.identificador,
      periodo,
      total_a_pagar: cuenta.totalAPagar,
    },
  });
});

export const dynamic = 'force-dynamic';
