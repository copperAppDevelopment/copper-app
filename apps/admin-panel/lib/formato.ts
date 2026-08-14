/**
 * Formateo para presentación. Sin React: se puede usar desde cualquier capa.
 *
 * Estas funciones estaban copiadas en tres páginas y las copias divergieron: solo una
 * corregía el desfase de zona horaria de las fechas sin hora. Vive aquí para que no
 * vuelva a pasar.
 */

const MONEDA = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function formatoMoneda(valor: number | string | null | undefined): string {
  return MONEDA.format(Number(valor ?? 0));
}

/**
 * `new Date("2026-07-01")` se interpreta como UTC medianoche, así que en Colombia
 * (UTC-5) se muestra como 30 de junio. Añadir la hora local lo evita.
 */
function aFechaLocal(valor: string): Date {
  return new Date(valor.length === 10 ? `${valor}T00:00:00` : valor);
}

export function formatoFecha(valor: string | null | undefined): string {
  if (!valor) return "—";
  return aFechaLocal(valor).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Variante corta, sin año: la usa el dashboard en la tabla de solicitudes. */
export function formatoFechaCorta(valor: string | null | undefined): string {
  if (!valor) return "N/A";
  return aFechaLocal(valor).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
  });
}

export function nombreCompleto(
  persona: { nombres?: string | null; apellidos?: string | null } | null | undefined,
  porDefecto = "Sin nombre"
): string {
  return [persona?.nombres, persona?.apellidos].filter(Boolean).join(" ") || porDefecto;
}
