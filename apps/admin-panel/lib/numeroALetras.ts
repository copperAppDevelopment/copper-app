/**
 * Números a letras, en español de Colombia, para el importe de la cuenta de cobro.
 *
 * Sin React ni dependencias: no había nada parecido en el repo y ninguna librería instalada.
 *
 * Las irregularidades del castellano que se escapan en las implementaciones ingenuas y que
 * aquí están cubiertas:
 *
 * - Del 16 al 29 se escriben en una palabra: «dieciséis», «veintiuno», no «diez y seis».
 * - Las centenas no son regulares: 500 es «quinientos», 700 «setecientos», 900 «novecientos».
 * - 100 exacto es «cien»; 101 es «ciento uno».
 * - «uno» se apocopa delante del nombre de la escala: «veintiún mil», «treinta y un mil».
 * - Mil no lleva «un» delante: 1.000 es «mil», no «un mil». Un millón sí: «un millón».
 * - «millón» se pluraliza y «mil» no: «dos millones», «dos mil».
 */

const UNIDADES = [
  "cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve",
  "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete",
  "dieciocho", "diecinueve", "veinte", "veintiuno", "veintidós", "veintitrés",
  "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve",
];

const DECENAS = [
  "", "", "veinte", "treinta", "cuarenta", "cincuenta",
  "sesenta", "setenta", "ochenta", "noventa",
];

const CENTENAS = [
  "", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos",
  "seiscientos", "setecientos", "ochocientos", "novecientos",
];

/**
 * «veintiuno» → «veintiún», «treinta y uno» → «treinta y un».
 *
 * La tilde importa: apocopar «veintiuno» quitándole la «o» produce «veintiun», que está mal
 * escrito. Por eso es un caso aparte y no un recorte de la última letra.
 */
function apocope(texto: string): string {
  return texto.replace(/veintiuno$/, "veintiún").replace(/(?<!veinti)uno$/, "un");
}

/** 0-999. `apocopar` convierte el «uno» final en «un», para «veintiún mil». */
function hastaMil(n: number, apocopar: boolean): string {
  if (n === 0) return "";
  if (n === 100) return "cien";

  const centena = Math.floor(n / 100);
  const resto = n % 100;
  const partes: string[] = [];

  if (centena > 0) partes.push(CENTENAS[centena]!);

  if (resto > 0) {
    let texto: string;

    if (resto < 30) {
      texto = UNIDADES[resto]!;
    } else {
      const decena = Math.floor(resto / 10);
      const unidad = resto % 10;
      texto = unidad === 0
        ? DECENAS[decena]!
        : `${DECENAS[decena]} y ${UNIDADES[unidad]}`;
    }

    if (apocopar && resto % 10 === 1 && resto !== 11) texto = apocope(texto);

    partes.push(texto);
  }

  return partes.join(" ");
}

/**
 * El número en letras, en minúsculas y sin la moneda.
 *
 * Trabaja con enteros: el peso colombiano no tiene céntimos y toda la facturación del sistema
 * valida importes enteros. Los decimales que traiga la base —la mora los tiene— se redondean.
 */
export function numeroALetras(valor: number): string {
  const entero = Math.round(Math.abs(Number(valor) || 0));

  if (entero === 0) return "cero";
  if (entero >= 1_000_000_000_000) return String(entero);

  const millones = Math.floor(entero / 1_000_000);
  const miles = Math.floor((entero % 1_000_000) / 1000);
  const resto = entero % 1000;

  const partes: string[] = [];

  if (millones === 1) {
    partes.push("un millón");
  } else if (millones > 1) {
    // Los millones se cuentan con la misma función: 21.000.000 es «veintiún millones».
    partes.push(`${apocope(numeroALetras(millones))} millones`);
  }

  if (miles === 1) {
    // «mil», nunca «un mil».
    partes.push("mil");
  } else if (miles > 1) {
    partes.push(`${hastaMil(miles, true)} mil`);
  }

  if (resto > 0) partes.push(hastaMil(resto, false));

  const texto = partes.join(" ");
  return Number(valor) < 0 ? `menos ${texto}` : texto;
}

/** Como lo escribe una cuenta de cobro: en mayúsculas y con la moneda. */
export function pesosEnLetras(valor: number): string {
  return `${numeroALetras(valor).toUpperCase()} PESOS M/CTE`;
}
