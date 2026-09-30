'use client';

import * as React from "react";
import { Megaphone, Search, Eye, Trash2, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CommonTable } from "@/components/ui/table";
import { formatoFecha } from "@/lib/formato";
import type { TablaLocal } from "@/hooks/useTablaLocal";
import { OPCIONES_TIPO, OPCIONES_NOVEDAD, dirigidoA } from "../types";
import type { Comunicado, TipoComunicado, TipoNovedad } from "../types";

export interface ComunicadosTablaProps {
  tabla: TablaLocal<Comunicado>;
  filtro: string;
  onFiltroChange: (valor: string) => void;
  filtroTipo: TipoComunicado | "";
  onTipoChange: (valor: TipoComunicado | "") => void;
  filtroNovedad: TipoNovedad | "";
  onNovedadChange: (valor: TipoNovedad | "") => void;
  onVer: (comunicado: Comunicado) => void;
  onEliminar: (comunicado: Comunicado) => void;
  operandoId: string | null;
}

export function ComunicadosTabla({
  tabla, filtro, onFiltroChange, filtroTipo, onTipoChange, filtroNovedad, onNovedadChange,
  onVer, onEliminar, operandoId,
}: ComunicadosTablaProps) {
  const columnas = [
    {
      key: "fecha_publicacion",
      label: "Publicado",
      sortable: true,
      render: (c: Comunicado) => (
        <span className="whitespace-nowrap">{formatoFecha(c.fecha_publicacion)}</span>
      ),
    },
    {
      key: "titulo",
      label: "Comunicado",
      sortable: true,
      render: (c: Comunicado) => (
        <div className="max-w-72">
          <p className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
            <span className="truncate">{c.titulo}</span>
            {c.adjunto && (
              <Paperclip className="w-3.5 h-3.5 text-zinc-400 shrink-0" aria-label="Con adjunto" />
            )}
          </p>
          {c.descripcion && (
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">{c.descripcion}</p>
          )}
        </div>
      ),
    },
    {
      key: "tipo",
      label: "Tipo",
      sortable: true,
      render: (c: Comunicado) => (
        <div className="flex flex-wrap gap-1">
          <Badge variant={c.tipo === "Reporte" ? "warning" : "brand"}>{c.tipo}</Badge>
          <Badge variant="neutral">{c.tipo_novedad}</Badge>
        </div>
      ),
    },
    {
      key: "numero_apartamento",
      label: "Dirigido a",
      sortable: true,
      render: (c: Comunicado) => <span className="whitespace-nowrap">{dirigidoA(c)}</span>,
    },
    {
      key: "destinatarios",
      label: "Enviado a",
      sortable: true,
      render: (c: Comunicado) =>
        c.destinatarios > 0
          ? <span className="whitespace-nowrap">{c.destinatarios} {c.destinatarios === 1 ? "residente" : "residentes"}</span>
          : <span className="text-zinc-400" title="Sin notificación registrada">—</span>,
    },
    {
      key: "acciones",
      label: "",
      render: (c: Comunicado) => (
        <div className="flex items-center gap-1 justify-end">
          <Button variant="ghost" size="sm" icon={<Eye className="w-3.5 h-3.5" />} onClick={() => onVer(c)}>
            Ver
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={() => onEliminar(c)}
            loading={operandoId === c.id}
            disabled={operandoId !== null && operandoId !== c.id}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  const hayFiltro = Boolean(filtro.trim()) || Boolean(filtroTipo) || Boolean(filtroNovedad);

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-brand" />
          <span>Historial de comunicados</span>
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
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:flex-wrap gap-3">
        <div className="flex-1 min-w-48 max-w-xs">
          <Input
            id="filtro-comunicado"
            placeholder="Buscar por título, texto o apartamento…"
            value={filtro}
            onChange={(e) => onFiltroChange(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="w-full sm:w-44">
          <Select
            id="filtro-tipo-comunicado"
            value={filtroTipo}
            onChange={(e) => onTipoChange(e.target.value as TipoComunicado | "")}
            options={[{ value: "", label: "Todos los tipos" }, ...OPCIONES_TIPO]}
          />
        </div>
        <div className="w-full sm:w-44">
          <Select
            id="filtro-novedad-comunicado"
            value={filtroNovedad}
            onChange={(e) => onNovedadChange(e.target.value as TipoNovedad | "")}
            options={[{ value: "", label: "Todas las novedades" }, ...OPCIONES_NOVEDAD]}
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
            ? "Ningún comunicado coincide con los filtros aplicados."
            : "Todavía no se ha publicado ningún comunicado en este conjunto."
        }
      />
    </Card>
  );
}
