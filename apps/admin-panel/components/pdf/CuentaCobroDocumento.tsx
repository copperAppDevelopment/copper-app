import * as React from "react";
import {
  Document, Page, Text, View, StyleSheet, renderToBuffer, type DocumentProps,
} from "@react-pdf/renderer";
import { formatoMoneda, formatoFecha } from "@/lib/formato";
import { pesosEnLetras } from "@/lib/numeroALetras";
import type { CuentaCobro } from "@/lib/cuentaCobro";

/**
 * La cuenta de cobro mensual.
 *
 * Solo servidor: `@react-pdf/renderer` está en `serverExternalPackages`. No se importa desde
 * ningún componente de página.
 *
 * No lleva el logo del conjunto aunque `foto_url` exista: `@react-pdf/renderer` descarga la
 * imagen al renderizar, y una URL caída o lenta convertiría la descarga en un fallo. El
 * encabezado va en texto, que siempre sale.
 */

const MARCA = "#8A1C14";
const TINTA = "#18181b";
const SUAVE = "#71717a";
const LINEA = "#e4e4e7";

const s = StyleSheet.create({
  pagina: { paddingTop: 36, paddingBottom: 48, paddingHorizontal: 40, fontSize: 9, color: TINTA, fontFamily: "Helvetica" },

  cabecera: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderBottomWidth: 2, borderBottomColor: MARCA, paddingBottom: 12 },
  emisorNombre: { fontSize: 15, fontFamily: "Helvetica-Bold", color: MARCA, marginBottom: 4 },
  emisorLinea: { fontSize: 8.5, color: SUAVE, marginBottom: 1.5 },

  sello: { alignItems: "flex-end" },
  selloTitulo: { fontSize: 8, fontFamily: "Helvetica-Bold", color: SUAVE, letterSpacing: 1 },
  selloId: { fontSize: 13, fontFamily: "Helvetica-Bold", color: TINTA, marginTop: 3 },
  selloDato: { fontSize: 8.5, color: SUAVE, marginTop: 3 },

  bloques: { flexDirection: "row", gap: 12, marginTop: 16 },
  bloque: { flex: 1, borderWidth: 1, borderColor: LINEA, borderRadius: 6, padding: 10 },
  bloqueTitulo: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: SUAVE, letterSpacing: 0.8, marginBottom: 5 },
  bloqueFuerte: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  bloqueLinea: { fontSize: 8.5, color: SUAVE, marginBottom: 1.5 },

  seccion: { fontSize: 8, fontFamily: "Helvetica-Bold", color: SUAVE, letterSpacing: 1, marginTop: 20, marginBottom: 7 },

  filaCabecera: { flexDirection: "row", backgroundColor: "#fafafa", borderTopWidth: 1, borderBottomWidth: 1, borderColor: LINEA, paddingVertical: 6, paddingHorizontal: 8 },
  fila: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: LINEA, paddingVertical: 7, paddingHorizontal: 8 },
  th: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: SUAVE, letterSpacing: 0.5 },

  colCodigo: { width: "16%" },
  colConcepto: { width: "50%" },
  colDescuento: { width: "17%", textAlign: "right" },
  colValor: { width: "17%", textAlign: "right" },

  conceptoNombre: { fontFamily: "Helvetica-Bold", fontSize: 9 },
  conceptoNota: { fontSize: 7.5, color: SUAVE, marginTop: 1.5 },

  totales: { marginTop: 16, marginLeft: "45%" },
  totalFila: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  totalEtiqueta: { fontSize: 9, color: SUAVE },
  totalValor: { fontSize: 9, fontFamily: "Helvetica-Bold" },
  totalPagarFila: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 2, borderTopColor: MARCA, marginTop: 5, paddingTop: 7 },
  totalPagarEtiqueta: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  totalPagarValor: { fontSize: 14, fontFamily: "Helvetica-Bold", color: MARCA },

  letras: { marginTop: 16, borderWidth: 1, borderColor: LINEA, borderRadius: 6, padding: 10, backgroundColor: "#fafafa" },
  letrasTexto: { fontSize: 9, fontFamily: "Helvetica-Bold", marginTop: 3 },

  prontoPago: { marginTop: 12, borderWidth: 1, borderColor: "#bbf7d0", borderRadius: 6, padding: 10, backgroundColor: "#f0fdf4" },
  prontoTitulo: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#166534" },
  prontoTexto: { fontSize: 8.5, color: "#166534", marginTop: 3, lineHeight: 1.4 },
  prontoValor: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#166534", marginTop: 4 },

  pie: { position: "absolute", bottom: 26, left: 40, right: 40, borderTopWidth: 1, borderTopColor: LINEA, paddingTop: 8 },
  pieTexto: { fontSize: 7.5, color: SUAVE, textAlign: "center", lineHeight: 1.4 },
});

/**
 * Las fuentes estándar del PDF no traen guion largo ni signo menos: al imprimirlos, el glifo
 * se pierde **sin avisar** y la celda queda vacía. Todo lo que se pinte aquí usa el guion
 * corriente.
 */
const VACIO = "-";

/** El mes, escrito: «septiembre de 2026». */
function mesEnLetras(periodo: string): string {
  const anio = Number(periodo.slice(0, 4));
  const mes = Number(periodo.slice(5, 7));
  if (!anio || !mes) return periodo;
  const nombre = new Date(Date.UTC(anio, mes - 1, 1)).toLocaleDateString("es-CO", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return nombre;
}

/**
 * El PDF ya renderizado.
 *
 * La conversión existe porque `renderToBuffer` exige un elemento cuyas props sean
 * `DocumentProps`, y un componente envoltorio nunca lo cumple aunque devuelva un `<Document>`.
 * Es una limitación de los tipos de la librería, no un fallo real, y se queda encerrada aquí
 * en vez de repetirse en cada sitio que genere un PDF.
 */
export function renderCuentaCobro(cuenta: CuentaCobro): Promise<Buffer> {
  const documento = CuentaCobroDocumento({ cuenta }) as React.ReactElement<DocumentProps>;
  return renderToBuffer(documento);
}

export function CuentaCobroDocumento({ cuenta }: { cuenta: CuentaCobro }) {
  const { emisor, destinatario, prontoPago } = cuenta;

  const lineasEmisor = [
    emisor.nit ? `NIT ${emisor.nit}` : null,
    [emisor.direccion, emisor.ciudad].filter(Boolean).join(" · ") || null,
    [emisor.telefono, emisor.email].filter(Boolean).join(" · ") || null,
  ].filter(Boolean) as string[];

  const ubicacion = [
    destinatario.torre ? `Torre ${destinatario.torre}` : null,
    destinatario.piso ? `Piso ${destinatario.piso}` : null,
    destinatario.direccion,
  ].filter(Boolean) as string[];

  return (
    <Document
      title={`Cuenta de cobro ${cuenta.identificador}`}
      author={emisor.nombre}
      subject={`Cuenta de cobro de ${mesEnLetras(cuenta.periodo)}`}
    >
      <Page size="LETTER" style={s.pagina}>
        <View style={s.cabecera}>
          <View style={{ flex: 1, paddingRight: 16 }}>
            <Text style={s.emisorNombre}>{emisor.nombre.trim().toUpperCase()}</Text>
            {lineasEmisor.map(linea => (
              <Text key={linea} style={s.emisorLinea}>{linea}</Text>
            ))}
          </View>

          <View style={s.sello}>
            <Text style={s.selloTitulo}>CUENTA DE COBRO</Text>
            <Text style={s.selloId}>{cuenta.identificador}</Text>
            <Text style={s.selloDato}>{mesEnLetras(cuenta.periodo)}</Text>
          </View>
        </View>

        <View style={s.bloques}>
          <View style={s.bloque}>
            <Text style={s.bloqueTitulo}>APARTAMENTO</Text>
            <Text style={s.bloqueFuerte}>{destinatario.numeroApartamento}</Text>
            {ubicacion.map(linea => (
              <Text key={linea} style={s.bloqueLinea}>{linea}</Text>
            ))}
            {destinatario.residentes.length > 0 && (
              <Text style={[s.bloqueLinea, { marginTop: 5 }]}>
                {destinatario.residentes.length === 1 ? "Residente" : "Residentes"}
              </Text>
            )}
            {destinatario.residentes.map(r => (
              <Text key={r.nombre} style={{ fontSize: 8.5 }}>
                {r.nombre}{r.documento ? ` · ${r.documento}` : ""}
              </Text>
            ))}
          </View>

          <View style={s.bloque}>
            <Text style={s.bloqueTitulo}>FECHAS</Text>
            <Text style={s.bloqueLinea}>Fecha de la cuenta</Text>
            <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 7 }}>
              {formatoFecha(cuenta.fechaEmision)}
            </Text>
            <Text style={s.bloqueLinea}>Vence el</Text>
            <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", color: MARCA }}>
              {formatoFecha(cuenta.fechaVencimiento)}
            </Text>
          </View>
        </View>

        <Text style={s.seccion}>CONCEPTOS DEL MES</Text>

        <View style={s.filaCabecera}>
          <Text style={[s.th, s.colCodigo]}>CÓDIGO</Text>
          <Text style={[s.th, s.colConcepto]}>CONCEPTO</Text>
          <Text style={[s.th, s.colDescuento]}>PRONTO PAGO</Text>
          <Text style={[s.th, s.colValor]}>VALOR</Text>
        </View>

        {cuenta.conceptos.length === 0 ? (
          <View style={s.fila}>
            <Text style={{ color: SUAVE }}>Este mes no generó cargos nuevos.</Text>
          </View>
        ) : (
          cuenta.conceptos.map((c, i) => (
            <View key={`${c.codigo}-${i}`} style={s.fila} wrap={false}>
              <Text style={s.colCodigo}>{c.codigo}</Text>
              <View style={s.colConcepto}>
                <Text style={s.conceptoNombre}>{c.nombre}</Text>
                {c.descripcion ? <Text style={s.conceptoNota}>{c.descripcion}</Text> : null}
                {c.origen === "manual" ? <Text style={s.conceptoNota}>Cobro puntual</Text> : null}
              </View>
              <Text style={s.colDescuento}>
                {c.descuento > 0 ? `-${formatoMoneda(c.descuento)}` : VACIO}
              </Text>
              <Text style={[s.colValor, { fontFamily: "Helvetica-Bold" }]}>
                {formatoMoneda(c.valor)}
              </Text>
            </View>
          ))
        )}

        <View style={s.totales}>
          <View style={s.totalFila}>
            <Text style={s.totalEtiqueta}>Saldo anterior</Text>
            <Text style={s.totalValor}>{formatoMoneda(cuenta.saldoAnterior)}</Text>
          </View>
          <View style={s.totalFila}>
            <Text style={s.totalEtiqueta}>Cuotas y cargos del mes</Text>
            <Text style={s.totalValor}>{formatoMoneda(cuenta.cargosDelMes)}</Text>
          </View>
          {cuenta.pagosDelMes > 0 && (
            <View style={s.totalFila}>
              <Text style={s.totalEtiqueta}>Pagos aplicados a este periodo</Text>
              <Text style={s.totalValor}>-{formatoMoneda(cuenta.pagosDelMes)}</Text>
            </View>
          )}
          <View style={s.totalPagarFila}>
            <Text style={s.totalPagarEtiqueta}>TOTAL A PAGAR</Text>
            <Text style={s.totalPagarValor}>{formatoMoneda(cuenta.totalAPagar)}</Text>
          </View>
        </View>

        <View style={s.letras}>
          <Text style={s.bloqueTitulo}>VALOR EN LETRAS</Text>
          <Text style={s.letrasTexto}>{pesosEnLetras(cuenta.totalAPagar)}</Text>
        </View>

        {prontoPago && (
          <View style={s.prontoPago}>
            <Text style={s.prontoTitulo}>Descuento por pronto pago</Text>
            {/* Con la fecha exacta y no «el día N de este mes»: esta cuenta se puede descargar
                meses después, y entonces «este mes» no querría decir nada. */}
            <Text style={s.prontoTexto}>
              Si pagas hasta el {formatoFecha(prontoPago.fechaLimite)}, se te descuentan{" "}
              {formatoMoneda(prontoPago.descuento)}. Cuenta la fecha en que pagas, no la de
              registro.
            </Text>
            <Text style={s.prontoValor}>
              Pagando a tiempo: {formatoMoneda(prontoPago.totalConDescuento)}
            </Text>
          </View>
        )}

        <View style={s.pie} fixed>
          {/* Sin la URL: los enlaces de pasarela pasan de los cien caracteres y en papel no
              se pueden teclear. El botón de pago vive en la app, que es donde sirve. */}
          <Text style={s.pieTexto}>
            {cuenta.linkPago
              ? "Puedes pagar en línea desde la app, en la sección de balances."
              : "Consulta con la administración los medios de pago disponibles."}
          </Text>
          <Text style={s.pieTexto}>
            Documento generado automáticamente por Copper. {cuenta.identificador}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
