'use client';

import * as React from "react";
import { useState } from "react";
import { Wallet } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { CommonTable } from "../ui/table";
import { formatoMoneda, formatoFecha } from "../../lib/formato";

/**
 * Estado de cuenta, compartido por el detalle de apartamento y el de residente.
 *
 * Vive en `components/` y no en `features/` porque lo consumen dos módulos, y una
 * feature no debe importar de otra.
 */

export interface IndicadoresBalance {
  saldo_total: number | null;
  saldo_en_contra: number | null;
  saldo_a_favor: number | null;
  proximo_vencimiento: string | null;
  ultimo_pago: string | null;
}

export interface MovimientoBalance {
  periodo: string | null;
  fecha_movimiento: string | null;
  movimiento_tipo: string | null;
  concepto_cargo: string | null;
  origen_pago: string | null;
  debito: number | null;
  credito: number | null;
}

const PAGE_SIZE = 10;

export function IndicadoresBalanceCards({ indicadores }: { indicadores: IndicadoresBalance | null }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Saldo total</p>
        <p className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-2">
          {formatoMoneda(indicadores?.saldo_total)}
        </p>
      </Card>

      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Saldo en contra</p>
        <p className="text-2xl font-extrabold text-red-600 dark:text-red-400 mt-2">
          {formatoMoneda(indicadores?.saldo_en_contra)}
        </p>
      </Card>

      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Saldo a favor</p>
        <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
          {formatoMoneda(indicadores?.saldo_a_favor)}
        </p>
      </Card>

      <Card className="shadow-sm">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Próximo vencimiento</p>
        <p className="text-lg font-extrabold text-zinc-900 dark:text-white mt-2">
          {formatoFecha(indicadores?.proximo_vencimiento)}
        </p>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2">
          Último pago: {formatoFecha(indicadores?.ultimo_pago)}
        </p>
      </Card>
    </section>
  );
}

export function MovimientosTabla({
  movimientos,
  emptyMessage,
}: {
  movimientos: MovimientoBalance[];
  emptyMessage: string;
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const paginados = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return movimientos.slice(start, start + PAGE_SIZE);
  }, [movimientos, currentPage]);

  const columnas = [
    {
      key: "fecha_movimiento",
      label: "Fecha",
      render: (m: MovimientoBalance) => (
        <span className="whitespace-nowrap">{formatoFecha(m.fecha_movimiento)}</span>
      ),
    },
    { key: "periodo", label: "Periodo" },
    {
      key: "movimiento_tipo",
      label: "Tipo",
      render: (m: MovimientoBalance) => (
        <Badge variant={m.movimiento_tipo === "PAGO" ? "success" : "info"}>
          {m.movimiento_tipo || "—"}
        </Badge>
      ),
    },
    {
      key: "concepto_cargo",
      label: "Concepto",
      render: (m: MovimientoBalance) => m.concepto_cargo || m.origen_pago || "—",
    },
    {
      key: "debito",
      label: "Débito",
      render: (m: MovimientoBalance) =>
        m.debito ? <span className="text-red-600 dark:text-red-400">{formatoMoneda(m.debito)}</span> : "—",
    },
    {
      key: "credito",
      label: "Crédito",
      render: (m: MovimientoBalance) =>
        m.credito ? <span className="text-emerald-600 dark:text-emerald-400">{formatoMoneda(m.credito)}</span> : "—",
    },
  ];

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-brand" />
          <span>Estado de cuenta</span>
        </div>
      }
      headerActions={
        <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs px-2.5 py-1 rounded-full font-semibold">
          {movimientos.length} movimientos
        </span>
      }
      noPadding
      className="shadow-sm"
    >
      <CommonTable
        columns={columnas}
        data={paginados}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
        totalRows={movimientos.length}
        onPageChange={setCurrentPage}
        emptyMessage={emptyMessage}
      />
    </Card>
  );
}
