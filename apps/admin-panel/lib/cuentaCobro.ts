import { supabaseAdmin } from "./supabaseAdmin";
import { primerDiaDelPeriodo, ultimoDiaDelPeriodo, fechaLimiteProntoPago } from "./conceptos";

/**
 * Los datos de una cuenta de cobro mensual, sin saber nada de PDF.
 *
 * Recibe identificadores y no una sesión, a propósito: hoy lo llama la ruta del residente y
 * mañana lo llamará el panel para que el administrador descargue la de cualquier apartamento.
 *
 * **El saldo se calcula como lo hace `vista_mis_balances_indicadores`**: cargo a cargo,
 * restando lo que se le haya aplicado desde `cargos_recaudos`. No se usa
 * `vista_mis_balances_historial2`, que es un registro de movimientos y no cuadra como libro:
 * sus filas de PAGO traen el `valor_total` completo del recaudo, esté aplicado o no, así que
 * sumar débitos menos créditos da un número que no coincide con el saldo que ve el residente.
 *
 * Ir a las tablas evita de paso la trampa de esas vistas, que hacen `LEFT JOIN residentes` sin
 * filtrar por `activo` y devuelven cada movimiento repetido una vez por residente del
 * apartamento. Aquí no hace falta fijar un residente para esquivarlo.
 *
 * ⚠️ Las dos vistas restan el descuento por pronto pago **solo mientras el día del mes esté
 * dentro del plazo**, así que el saldo que muestra la app cambia solo el día siguiente. Un
 * documento no puede comportarse así: aquí el total es siempre el íntegro y el beneficio del
 * pronto pago se presenta aparte, con su fecha límite.
 */

export interface EmisorCuenta {
  nombre: string;
  direccion: string | null;
  ciudad: string | null;
  nit: string | null;
  telefono: string | null;
  email: string | null;
  logoUrl: string | null;
}

export interface DestinatarioCuenta {
  numeroApartamento: string;
  direccion: string | null;
  torre: string | null;
  piso: number | null;
  residentes: { nombre: string; documento: string | null }[];
}

export interface ConceptoCuenta {
  codigo: string;
  nombre: string;
  descripcion: string | null;
  valor: number;
  descuento: number;
  /** `cron` o `manual`: se imprime para distinguir la facturación automática de un cobro puntual. */
  origen: string;
}

export interface ProntoPagoCuenta {
  /** La fecha exacta, `YYYY-MM-DD`, no «el día N de este mes». */
  fechaLimite: string;
  descuento: number;
  totalConDescuento: number;
}

export interface CuentaCobro {
  identificador: string;
  periodo: string;
  fechaEmision: string;
  fechaVencimiento: string;
  emisor: EmisorCuenta;
  destinatario: DestinatarioCuenta;
  conceptos: ConceptoCuenta[];
  cargosDelMes: number;
  pagosDelMes: number;
  saldoAnterior: number;
  totalAPagar: number;
  prontoPago: ProntoPagoCuenta | null;
  linkPago: string | null;
}

export class SinDatosCuenta extends Error {}

/**
 * `CC-202609-0007`. Derivado, no consecutivo: la misma cuenta siempre lleva el mismo número y
 * volver a descargarla no consume numeración ni exige guardar nada.
 */
export function identificadorCuenta(periodo: string, numeroApartamento: string): string {
  const mes = periodo.replace("-", "");
  const apto = numeroApartamento.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  // Solo se rellena con ceros cuando es un número: `A101` se dejaría irreconocible.
  const sufijo = /^\d+$/.test(apto) ? apto.padStart(4, "0") : apto;
  return `CC-${mes}-${sufijo || "SN"}`;
}

const suma = (valores: (number | string | null)[]) =>
  valores.reduce<number>((total, v) => total + Number(v ?? 0), 0);

export async function construirCuentaCobro(opciones: {
  conjuntoId: string;
  apartamentoId: string;
  periodo: string;
}): Promise<CuentaCobro> {
  const { conjuntoId, apartamentoId, periodo } = opciones;

  const [conjunto, apartamento, residentes, cargos, config] = await Promise.all([
    supabaseAdmin
      .from("conjuntos")
      .select("nombre, direccion, ciudad, nit, telefono, email, foto_url")
      .eq("id", conjuntoId)
      .maybeSingle(),

    supabaseAdmin
      .from("vista_detalle_apt")
      .select("numero_apt, direccion, nombre_torre, numero_piso")
      .eq("id_apt", apartamentoId)
      .maybeSingle(),

    supabaseAdmin
      .from("residentes")
      .select("ano_ingreso, users(nombres, apellidos, documento)")
      .eq("apartamento_id", apartamentoId)
      .eq("activo", true),

    // Todos los cargos del apartamento, no solo los del mes: el saldo anterior se calcula
    // con los de periodos previos y su parte ya aplicada.
    supabaseAdmin
      .from("cargos_mensuales")
      .select(
        "periodo, valor_base, valor_descuento, descuento_aplicado, valor_final, origen, fecha_generado, fecha_vencimiento, link_pago, conceptos_cobro(codigo, nombre, descripcion, aplica_descuento), cargos_recaudos(valor_aplicado)"
      )
      .eq("apartamento_id", apartamentoId),

    supabaseAdmin
      .from("conjuntos_configuracion")
      .select(
        "link_pago, pronto_pago_habilitado, pronto_pago_tipo, pronto_pago_valor, pronto_pago_porcentaje, pronto_pago_dias"
      )
      .eq("conjunto_id", conjuntoId)
      .maybeSingle(),
  ]);

  if (!conjunto.data) throw new SinDatosCuenta("No se encontró el conjunto.");
  if (!apartamento.data) throw new SinDatosCuenta("No se encontró el apartamento.");

  const todosLosCargos = (cargos.data ?? []) as any[];
  const aplicadoDe = (fila: any) =>
    suma((fila.cargos_recaudos ?? []).map((c: any) => c.valor_aplicado));

  const filasCargo = todosLosCargos.filter(f => f.periodo === periodo);

  // Un PDF con todo en blanco confunde más que un error: si el mes no generó cargos,
  // sencillamente no tiene cuenta de cobro.
  if (filasCargo.length === 0) {
    throw new SinDatosCuenta(`No hay movimientos registrados en ${periodo}.`);
  }

  const conceptos: ConceptoCuenta[] = filasCargo.map(fila => ({
    codigo: fila.conceptos_cobro?.codigo ?? "-",
    nombre: fila.conceptos_cobro?.nombre ?? "Concepto sin nombre",
    descripcion: fila.conceptos_cobro?.descripcion ?? null,
    valor: Number(fila.valor_final ?? 0),
    // Solo cuenta como descuento si el concepto admite pronto pago: el cron escribe la columna
    // igualmente, pero el beneficio no aplica a los que no lo permiten.
    descuento: fila.conceptos_cobro?.aplica_descuento ? Number(fila.valor_descuento ?? 0) : 0,
    origen: fila.origen ?? "cron",
  }));

  const cargosDelMes = suma(conceptos.map(c => c.valor));

  // Lo abonado al mes: el dinero aplicado más el descuento por pronto pago que ya se ganó.
  // Es la misma fórmula de `vista_mis_balances_indicadores`, para que las dos cifras cuadren.
  const pagosDelMes = suma(
    filasCargo.map(f => aplicadoDe(f) + Number(f.descuento_aplicado ?? 0))
  );

  // Lo que quedaba debiendo de los meses anteriores. Los recaudos que nadie aplicó no bajan el
  // saldo, igual que en la vista.
  const saldoAnterior = todosLosCargos
    .filter(f => (f.periodo ?? "") < periodo)
    .reduce(
      (total, f) =>
        total + Number(f.valor_final ?? 0) - aplicadoDe(f) - Number(f.descuento_aplicado ?? 0),
      0
    );

  const totalAPagar = saldoAnterior + cargosDelMes - pagosDelMes;

  const fechasGenerado = filasCargo.map(f => f.fecha_generado).filter(Boolean).sort();
  const fechasVence = filasCargo.map(f => f.fecha_vencimiento).filter(Boolean).sort();

  const cfg = config.data;
  const fechaLimite = fechaLimiteProntoPago(periodo, cfg?.pronto_pago_dias ?? null);

  /**
   * El descuento que todavía se puede ganar: solo de los cargos que lo admiten, que aún no lo
   * ganaron y que siguen debiendo algo. Sin este filtro el documento ofrecería un beneficio ya
   * cobrado, o uno sobre un cargo saldado.
   */
  const descuento = suma(
    filasCargo
      .filter(
        f =>
          f.conceptos_cobro?.aplica_descuento &&
          Number(f.descuento_aplicado ?? 0) === 0 &&
          Number(f.valor_final ?? 0) - aplicadoDe(f) > 0
      )
      .map(f => f.valor_descuento)
  );

  // Solo se ofrece si el plazo sigue abierto: una cuenta de agosto descargada en octubre no
  // puede prometer un descuento que ya nadie puede cobrar.
  const plazoVigente = Boolean(fechaLimite) && fechaLimite >= new Date().toISOString().slice(0, 10);

  const prontoPago: ProntoPagoCuenta | null =
    cfg?.pronto_pago_habilitado && descuento > 0 && plazoVigente
      ? { fechaLimite, descuento, totalConDescuento: totalAPagar - descuento }
      : null;

  return {
    identificador: identificadorCuenta(periodo, apartamento.data.numero_apt ?? ""),
    periodo,
    fechaEmision: (fechasGenerado[0] ?? primerDiaDelPeriodo(periodo)).slice(0, 10),
    fechaVencimiento: (fechasVence.at(-1) ?? ultimoDiaDelPeriodo(periodo)).slice(0, 10),

    emisor: {
      nombre: conjunto.data.nombre,
      direccion: conjunto.data.direccion,
      ciudad: conjunto.data.ciudad,
      nit: conjunto.data.nit,
      telefono: conjunto.data.telefono,
      email: conjunto.data.email,
      logoUrl: conjunto.data.foto_url,
    },

    destinatario: {
      numeroApartamento: apartamento.data.numero_apt ?? "-",
      direccion: apartamento.data.direccion,
      torre: apartamento.data.nombre_torre,
      piso: apartamento.data.numero_piso,
      residentes: ((residentes.data ?? []) as any[])
        .map(r => ({
          nombre: [r.users?.nombres, r.users?.apellidos].filter(Boolean).join(" "),
          documento: r.users?.documento ?? null,
        }))
        .filter(r => r.nombre),
    },

    conceptos,
    cargosDelMes,
    pagosDelMes,
    saldoAnterior,
    totalAPagar,
    prontoPago,
    linkPago: filasCargo.find(f => f.link_pago)?.link_pago ?? cfg?.link_pago ?? null,
  };
}
