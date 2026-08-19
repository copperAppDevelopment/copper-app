'use client';

import * as React from "react";
import { PackageCheck } from "lucide-react";
import { CommonTable } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatoFecha } from "@/lib/formato";
import { ETIQUETA_ESTADO_ENVIO, VARIANTE_ESTADO_ENVIO } from "@/lib/recepcion";
import type { EstadoEnvio } from "@/lib/recepcion";
import type { EstadoRecepcion } from "../hooks/useRecepcion";
import type { EnvioRecepcion } from "../types";

export interface EnviosTablaProps {
  r: EstadoRecepcion;
  onEntregar: (envio: EnvioRecepcion) => void;
}

export function EnviosTabla({ r, onEntregar }: EnviosTablaProps) {
  const columnas = [
    {
      key: "empresa_mensajeria",
      label: "Empresa",
      sortable: true,
      render: (e: EnvioRecepcion) => (
        <div className="min-w-0">
          <p className="font-semibold text-zinc-900 dark:text-white truncate">
            {e.empresa_mensajeria}
          </p>
          {e.observaciones && (
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
              {e.observaciones}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "label_apartamento",
      label: "Apartamento",
      sortable: true,
      render: (e: EnvioRecepcion) => e.label_apartamento ?? "—",
    },
    {
      key: "fecha",
      label: "Recibido",
      sortable: true,
      render: (e: EnvioRecepcion) => (
        <div className="min-w-0">
          <p>{formatoFecha(e.fecha)}</p>
          {e.registrado_por_nombre && (
            <p className="text-[11px] text-zinc-400">por {e.registrado_por_nombre}</p>
          )}
        </div>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      sortable: true,
      render: (e: EnvioRecepcion) => {
        const estado = e.estado as EstadoEnvio;
        return (
          <div className="min-w-0 space-y-0.5">
            <Badge variant={VARIANTE_ESTADO_ENVIO[estado] ?? "neutral"}>
              {ETIQUETA_ESTADO_ENVIO[estado] ?? estado}
            </Badge>
            {e.estado === "entregado" && e.recibido_por && (
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                a {e.recibido_por} · {formatoFecha(e.fecha_entrega)}
              </p>
            )}
          </div>
        );
      },
    },
    {
      key: "acciones",
      label: "",
      render: (e: EnvioRecepcion) =>
        e.estado === "pendiente" ? (
          <div className="flex justify-end">
            <Button
              size="sm"
              disabled={r.enviando}
              onClick={() => onEntregar(e)}
              icon={<PackageCheck className="w-3.5 h-3.5" />}
            >
              Entregar
            </Button>
          </div>
        ) : null,
    },
  ];

  return (
    <CommonTable
      columns={columnas}
      data={r.tablaEnvios.datos}
      sortBy={r.tablaEnvios.sortBy}
      sortOrder={r.tablaEnvios.sortOrder}
      onSort={r.tablaEnvios.handleSort}
      currentPage={r.tablaEnvios.currentPage}
      pageSize={r.tablaEnvios.pageSize}
      totalRows={r.tablaEnvios.totalRows}
      onPageChange={r.tablaEnvios.setCurrentPage}
      emptyMessage="No hay envíos en este periodo."
    />
  );
}
