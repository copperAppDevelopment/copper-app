import { URL_APP_STORE, URL_PLAY_STORE, URL_PANEL, URL_LANDING } from "../tiendas";

/**
 * El correo de invitación, con el diseño que mandó el cliente («Conjunto X ahora cuenta con
 * Copper»).
 *
 * HTML de correo, no de web: tablas, estilos en línea y ancho fijo de 600 px, porque Gmail,
 * Outlook y Mail de iOS ignoran casi todo lo demás. Las imágenes son PNG absolutas servidas por
 * el panel (`public/email/`): muchos clientes no muestran WebP.
 */

export interface DatosCorreoInvitacion {
  nombreConjunto: string;
  /** `Residente` recibe los botones de las tiendas; el equipo usa el panel, no la app. */
  rol: string;
  enlace: string;
  numeroApartamento: string | null;
  /** ISO: la fecha en que vence el enlace. */
  expiraEn: string;
}

/**
 * La imagen del celular del diseño. Mientras no haya un PNG exportado del diseño del cliente,
 * va en `null` y el correo se arma en una sola columna, sin ella.
 */
const IMAGEN_CELULAR: string | null = null;

const MARCA = "#8A1C14";
const OSCURO = "#111827";

const BENEFICIOS = [
  "Consultar saldos y movimientos.",
  "Realizar pagos en línea.",
  "Recibir comunicados y novedades.",
  "Gestionar solicitudes y PQRS.",
  "Administrar el ingreso de visitantes.",
];

const escapar = (texto: string) =>
  texto.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** «Lusitania» → «Conjunto Lusitania»; «Conjunto del Sol» se queda igual. */
const conElConjunto = (nombre: string) =>
  /^conjunto/i.test(nombre.trim()) ? nombre.trim() : `Conjunto ${nombre.trim()}`;

const fechaLarga = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CO", {
    day: "numeric", month: "long", year: "numeric", timeZone: "America/Bogota",
  });

function boton(texto: string, url: string, color: string) {
  return `
    <tr><td style="padding:0 0 10px 0;">
      <a href="${url}" target="_blank"
         style="display:block;background:${color};color:#ffffff;text-decoration:none;font-weight:700;
                font-size:14px;line-height:18px;text-align:center;padding:12px 16px;border-radius:8px;">
        ${texto}
      </a>
    </td></tr>`;
}

export function asuntoInvitacion({ nombreConjunto, rol }: DatosCorreoInvitacion) {
  return rol === "Residente"
    ? `${conElConjunto(nombreConjunto)} ahora cuenta con Copper`
    : `Invitación al equipo de ${nombreConjunto.trim()} en Copper`;
}

export function htmlInvitacion(datos: DatosCorreoInvitacion): string {
  const titulo = escapar(conElConjunto(datos.nombreConjunto));
  const esResidente = datos.rol === "Residente";
  const apto = datos.numeroApartamento
    ? `<p style="margin:0 0 12px 0;font-size:13px;color:#374151;">Apartamento asignado: <strong>${escapar(datos.numeroApartamento)}</strong></p>`
    : "";

  const texto = esResidente
    ? "Consulta tu cuenta, realiza pagos, recibe comunicados y gestiona solicitudes desde tu celular."
    : `Te invitaron a unirte al equipo del conjunto como <strong>${escapar(datos.rol)}</strong>. Gestionarás el conjunto desde el panel administrativo.`;

  const llamado = esResidente
    ? "Crea tu cuenta con el botón de abajo y luego descarga la app para iniciar sesión."
    : "Crea tu cuenta con el botón de abajo para entrar al panel.";

  const tiendas = esResidente
    ? boton("Descargar para iPhone", URL_APP_STORE, OSCURO) + boton("Descargar para Android", URL_PLAY_STORE, OSCURO)
    : "";

  const columnaTexto = `
    <h1 style="margin:0 0 12px 0;font-size:24px;line-height:30px;color:${OSCURO};font-weight:800;">
      ${titulo} ahora cuenta con Copper
    </h1>
    <p style="margin:0 0 12px 0;font-size:14px;line-height:21px;color:#374151;">${texto}</p>
    ${apto}
    <p style="margin:0 0 16px 0;font-size:14px;line-height:21px;color:${OSCURO};font-weight:700;">${llamado}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${boton("Crear mi cuenta", datos.enlace, MARCA)}
      ${tiendas}
    </table>
    <p style="margin:6px 0 0 0;font-size:11px;line-height:16px;color:#6b7280;">
      El enlace para crear tu cuenta vence el ${fechaLarga(datos.expiraEn)}.
    </p>`;

  const cuerpo = IMAGEN_CELULAR
    ? `<tr>
         <td width="44%" valign="middle" align="center" style="padding:0 12px 0 0;">
           <img src="${IMAGEN_CELULAR}" width="220" alt="La app de Copper en un celular" style="display:block;width:220px;max-width:100%;height:auto;border:0;" />
         </td>
         <td width="56%" valign="middle">${columnaTexto}</td>
       </tr>`
    : `<tr><td>${columnaTexto}</td></tr>`;

  const beneficios = esResidente
    ? `<tr><td style="padding:24px 32px;background:#fef2f2;">
         <p style="margin:0 0 12px 0;font-size:16px;font-weight:700;color:${OSCURO};text-align:center;">Con Copper puedes:</p>
         ${BENEFICIOS.map(b => `<p style="margin:0 0 8px 0;font-size:14px;color:#374151;"><span style="color:${MARCA};font-weight:700;">&#10003;</span>&nbsp;&nbsp;${b}</p>`).join("")}
       </td></tr>`
    : "";

  return `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapar(asuntoInvitacion(datos))}</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6;">
    <tr><td align="center" style="padding:24px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr><td align="center" style="padding:32px 32px 24px 32px;">
          <img src="${URL_PANEL}/email/logo-copper.png" width="140" alt="Copper" style="display:block;width:140px;height:auto;border:0;" />
        </td></tr>
        <tr><td style="padding:0 32px 32px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${cuerpo}</table>
        </td></tr>
        ${beneficios}
        <tr><td align="center" style="padding:24px 32px;">
          <a href="${URL_LANDING}" target="_blank" style="color:${MARCA};font-size:14px;font-weight:700;">Conoce más sobre Copper</a>
        </td></tr>
        <tr><td align="center" style="padding:20px 32px;background:${OSCURO};">
          <p style="margin:0 0 6px 0;font-size:12px;color:#d1d5db;">Enviado por no-reply@copperapp.co. Por favor, no respondas a este correo.</p>
          <a href="${URL_LANDING}" target="_blank" style="font-size:12px;color:#d1d5db;">copperapp.co</a>
        </td></tr>
      </table>
      <p style="margin:16px 0 0 0;font-size:11px;color:#9ca3af;">Si no esperabas esta invitación, puedes ignorar este correo.</p>
    </td></tr>
  </table>
</body>
</html>`;
}

/** La versión en texto plano, para los clientes que no muestran HTML y para los filtros de spam. */
export function textoInvitacion(datos: DatosCorreoInvitacion): string {
  const esResidente = datos.rol === "Residente";
  return [
    `${conElConjunto(datos.nombreConjunto)} ahora cuenta con Copper.`,
    "",
    esResidente
      ? "Consulta tu cuenta, realiza pagos, recibe comunicados y gestiona solicitudes desde tu celular."
      : `Te invitaron a unirte al equipo del conjunto como ${datos.rol}.`,
    datos.numeroApartamento ? `Apartamento asignado: ${datos.numeroApartamento}` : "",
    "",
    `Crea tu cuenta aquí: ${datos.enlace}`,
    `El enlace vence el ${fechaLarga(datos.expiraEn)}.`,
    ...(esResidente
      ? ["", `Descarga la app para iPhone: ${URL_APP_STORE}`, `Descarga la app para Android: ${URL_PLAY_STORE}`]
      : []),
    "",
    "Si no esperabas esta invitación, puedes ignorar este correo.",
    "— El equipo de Copper",
  ].filter((linea, i, todas) => linea !== "" || todas[i - 1] !== "").join("\n");
}
