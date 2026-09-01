import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CustomCard } from '../../../components/common/CustomCard';
import { useCuentaCobro } from '../hooks/useCuentaCobro';

interface DescargarCuentaCobroProps {
  /** El historial que ya cargó `useBalancesData`; de ahí salen los meses disponibles. */
  history?: { periodo?: string | null }[];
}

/** «2026-09» → «Septiembre 2026». */
function etiquetaPeriodo(periodo: string): string {
  const anio = Number(periodo.slice(0, 4));
  const mes = Number(periodo.slice(5, 7));
  if (!anio || !mes) return periodo;

  const nombre = new Date(Date.UTC(anio, mes - 1, 1)).toLocaleDateString('es-CO', {
    month: 'long',
    timeZone: 'UTC',
  });
  return `${nombre.charAt(0).toUpperCase()}${nombre.slice(1)} ${anio}`;
}

/**
 * Descarga de la cuenta de cobro del mes.
 *
 * Los meses no necesitan endpoint propio: cada movimiento del historial trae su `periodo`, así
 * que la lista se deduce de lo que ya está cargado. Si no hay ninguno, la tarjeta no se pinta.
 */
export function DescargarCuentaCobro({ history }: DescargarCuentaCobroProps) {
  const { descargar, descargando } = useCuentaCobro();
  const [abierto, setAbierto] = useState(false);

  const periodos = useMemo(() => {
    const unicos = new Set<string>();
    for (const movimiento of history ?? []) {
      const p = movimiento?.periodo;
      if (p && /^\d{4}-\d{2}$/.test(p)) unicos.add(p);
    }
    return [...unicos].sort().reverse();
  }, [history]);

  if (periodos.length === 0) return null;

  const ultimo = periodos[0];
  const anteriores = periodos.slice(1);

  return (
    <CustomCard style={styles.tarjeta}>
      <Text style={styles.titulo}>Cuenta de cobro</Text>
      <Text style={styles.explicacion}>
        Descarga el detalle del mes en PDF: conceptos, saldo anterior y total a pagar.
      </Text>

      <TouchableOpacity
        style={styles.botonPrincipal}
        activeOpacity={0.8}
        disabled={descargando !== null}
        onPress={() => descargar(ultimo)}
      >
        {descargando === ultimo ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.botonPrincipalTexto}>Descargar {etiquetaPeriodo(ultimo)}</Text>
        )}
      </TouchableOpacity>

      {anteriores.length > 0 && (
        <TouchableOpacity
          style={styles.alternar}
          activeOpacity={0.7}
          onPress={() => setAbierto(!abierto)}
        >
          <Text style={styles.alternarTexto}>
            {abierto ? 'Ocultar meses anteriores' : 'Ver meses anteriores'}
          </Text>
        </TouchableOpacity>
      )}

      {abierto &&
        anteriores.map((periodo) => (
          <TouchableOpacity
            key={periodo}
            style={styles.fila}
            activeOpacity={0.7}
            disabled={descargando !== null}
            onPress={() => descargar(periodo)}
          >
            <Text style={styles.filaTexto}>{etiquetaPeriodo(periodo)}</Text>
            {descargando === periodo ? (
              <ActivityIndicator size="small" color="#8A1C14" />
            ) : (
              <Text style={styles.filaAccion}>Descargar</Text>
            )}
          </TouchableOpacity>
        ))}
    </CustomCard>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    marginBottom: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  explicacion: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 6,
    marginBottom: 16,
    lineHeight: 18,
  },
  botonPrincipal: {
    backgroundColor: '#8A1C14',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  botonPrincipalTexto: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  alternar: {
    alignSelf: 'center',
    marginTop: 14,
  },
  alternarTexto: {
    color: '#64748b',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  filaTexto: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },
  filaAccion: {
    fontSize: 13,
    color: '#8A1C14',
    fontWeight: 'bold',
  },
});
