'use client';

import * as React from "react";
import { useRouter } from "next/navigation";
import { Users, Search, Eye, Home, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CommonTable } from "@/components/ui/table";
import type { TablaLocal } from "@/hooks/useTablaLocal";
import type { Residente, FiltroEstado } from "../types";

export interface ResidentesTablaProps {
  tabla: TablaLocal<Residente>;
  filtro: string;
  onFiltroChange: (valor: string) => void;
  filtroEstado: FiltroEstado;
  onEstadoChange: (valor: FiltroEstado) => void;
  onAsignar: (residente: Residente) => void;
  onRemover: (residente: Residente) => void;
}

export function ResidentesTabla({
  tabla, filtro, onFiltroChange, filtroEstado, onEstadoChange, onAsignar, onRemover,
}: ResidentesTablaProps) {
  const router = useRouter();

  const columnas = [
    {
      key: "nombre_completo",
      label: "Residente",
      sortable: true,
      render: (r: Residente) => (
        <div className="min-w-0">
          <p className="font-semibold text-zinc-900 dark:text-white truncate">
            {r.nombre_completo?.trim() || "Sin nombre"}
          </p>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
            {r.tipo_documento} {r.cedula}
          </p>
        </div>
      ),
    },
    {
      key: "email",
      label: "Correo",
      sortable: true,
      render: (r: Residente) => (
        <span className="block max-w-[200px] truncate" title={r.email || ""}>
          {r.email || "—"}
        </span>
      ),
    },
    {
      key: "contacto",
      label: "Teléfono",
      render: (r: Residente) => r.contacto || "—",
    },
    {
      key: "apartamento_numero",
      label: "Apartamento",
      sortable: true,
      render: (r: Residente) =>
        r.apartamento_numero
          ? <span>{r.apartamento_numero}{r.torre_nombre ? ` · ${r.torre_nombre}` : ""}</span>
          : <span className="text-zinc-400 dark:text-zinc-500">Sin asignar</span>,
    },
    {
      key: "activo",
      label: "Estado",
      sortable: true,
      render: (r: Residente) => {
        if (!r.activo) return <Badge variant="neutral">Inactivo</Badge>;
        if (!r.apartamento_id) return <Badge variant="warning">Pendiente</Badge>;
        return <Badge variant="success">Activo</Badge>;
      },
    },
    {
      key: "acciones",
      label: "",
      render: (r: Residente) => (
        <div className="flex items-center gap-1 justify-end">
          {!r.apartamento_id || !r.activo ? (
            <Button
              variant="ghost"
              size="sm"
              icon={<Home className="w-3.5 h-3.5" />}
              onClick={() => onAsignar(r)}
            >
              {r.activo ? "Asignar" : "Reasignar"}
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              icon={<UserMinus className="w-3.5 h-3.5" />}
              onClick={() => onRemover(r)}
            >
              Remover
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye className="w-3.5 h-3.5" />}
            onClick={() => router.push(`/admin/residentes/${r.residente_id}`)}
          >
            Detalle
          </Button>
        </div>
      ),
    },
  ];

  const hayFiltro = Boolean(filtro.trim()) || filtroEstado !== "todos";

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-brand" />
          <span>Listado de residentes</span>
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
            id="filtro-residente"
            placeholder="Buscar por nombre, correo o documento…"
            value={filtro}
            onChange={(e) => onFiltroChange(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            id="filtro-estado"
            value={filtroEstado}
            onChange={(e) => onEstadoChange(e.target.value as FiltroEstado)}
            options={[
              { value: "todos", label: "Todos los estados" },
              { value: "activos", label: "Activos" },
              { value: "pendientes", label: "Pendientes" },
              { value: "inactivos", label: "Inactivos" },
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
            ? "Ningún residente coincide con los filtros aplicados."
            : "Este conjunto todavía no tiene residentes registrados."
        }
      />
    </Card>
  );
}
