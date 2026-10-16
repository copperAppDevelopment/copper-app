'use client';

import * as React from "react";
import { Mail, Search, Send, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CommonTable } from "@/components/ui/table";
import { formatoFecha } from "@/lib/formato";
import type { TablaLocal } from "@/hooks/useTablaLocal";
import { ETIQUETA_ESTADO, sePuedeReenviar } from "../types";
import type { InvitacionConEstado, EstadoInvitacion, FiltroEstado } from "../types";

export interface InvitacionesTablaProps {
  tabla: TablaLocal<InvitacionConEstado>;
  filtro: string;
  onFiltroChange: (valor: string) => void;
  filtroEstado: FiltroEstado;
  onEstadoChange: (valor: FiltroEstado) => void;
  onReenviar: (invitacion: InvitacionConEstado) => void;
  operandoId: string | null;
}

const VARIANTE: Record<EstadoInvitacion, "neutral" | "success" | "warning" | "danger"> = {
  pendiente: "warning",
  vencida: "neutral",
  aceptada: "success",
  error: "danger",
};

export function InvitacionesTabla({
  tabla, filtro, onFiltroChange, filtroEstado, onEstadoChange, onReenviar, operandoId,
}: InvitacionesTablaProps) {
  const columnas = [
    {
      key: "email",
      label: "Correo",
      sortable: true,
      render: (i: InvitacionConEstado) => (
        <div className="min-w-0 max-w-64">
          <p className="font-semibold text-zinc-900 dark:text-white truncate" title={i.email}>{i.email}</p>
          {i.telefono && <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{i.telefono}</p>}
        </div>
      ),
    },
    {
      key: "numero_apartamento",
      label: "Apartamento",
      sortable: true,
      render: (i: InvitacionConEstado) =>
        i.numero_apartamento ?? <span className="text-zinc-400">Sin asignar</span>,
    },
    {
      key: "ultimo_envio_en",
      label: "Último envío",
      sortable: true,
      render: (i: InvitacionConEstado) => (
        <div className="whitespace-nowrap">
          <p>{formatoFecha(i.ultimo_envio_en ?? i.creado_en)}</p>
          {i.envios > 1 && (
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{i.envios} envíos</p>
          )}
        </div>
      ),
    },
    {
      key: "expira_en",
      label: "Vence",
      sortable: true,
      render: (i: InvitacionConEstado) =>
        i.usado
          ? <span className="text-zinc-400 whitespace-nowrap">Aceptada el {formatoFecha(i.usado_en)}</span>
          : <span className="whitespace-nowrap">{formatoFecha(i.expira_en)}</span>,
    },
    {
      key: "estado",
      label: "Estado",
      sortable: true,
      render: (i: InvitacionConEstado) => (
        <div className="max-w-56">
          <Badge variant={VARIANTE[i.estado]}>{ETIQUETA_ESTADO[i.estado]}</Badge>
          {i.error_envio && (
            <p
              className="text-[10px] text-red-600 dark:text-red-400 mt-1 line-clamp-2 flex gap-1"
              title={i.error_envio}
            >
              <AlertTriangle className="w-3 h-3 shrink-0 mt-px" />
              {i.error_envio}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "acciones",
      label: "",
      render: (i: InvitacionConEstado) =>
        sePuedeReenviar(i) ? (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              icon={<Send className="w-3.5 h-3.5" />}
              onClick={() => onReenviar(i)}
              loading={operandoId === i.id}
              disabled={operandoId !== null && operandoId !== i.id}
            >
              Reenviar
            </Button>
          </div>
        ) : null,
    },
  ];

  const hayFiltro = Boolean(filtro.trim()) || filtroEstado !== "todas";

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-brand" />
          <span>Invitaciones enviadas</span>
        </div>
      }
      headerActions={
        <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs px-2.5 py-1 rounded-full font-semibold">
          {tabla.totalRows} {hayFiltro ? "coinciden" : "en total"}
        </span>
      }
      noPadding
      className="shadow-sm"
    >
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-xs">
          <Input
            id="filtro-invitacion"
            placeholder="Buscar por correo, apartamento o teléfono…"
            value={filtro}
            onChange={(e) => onFiltroChange(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            id="filtro-estado-invitacion"
            value={filtroEstado}
            onChange={(e) => onEstadoChange(e.target.value as FiltroEstado)}
            options={[
              { value: "todas", label: "Todos los estados" },
              { value: "pendiente", label: "Pendientes" },
              { value: "vencida", label: "Vencidas" },
              { value: "error", label: "Con error de envío" },
              { value: "aceptada", label: "Aceptadas" },
            ]}
          />
        </div>
      </div>

      <CommonTable
        columns={columnas}
        data={tabla.datos}
        sortBy={tabla.sortBy}
        sortOrder={tabla.sortOrder}
        onSort={tabla.handleSort}
        currentPage={tabla.currentPage}
        pageSize={tabla.pageSize}
        totalRows={tabla.totalRows}
        onPageChange={tabla.setCurrentPage}
        emptyMessage={
          hayFiltro
            ? "Ninguna invitación coincide con los filtros aplicados."
            : "Todavía no se ha invitado a ningún residente de este conjunto."
        }
      />
    </Card>
  );
}
