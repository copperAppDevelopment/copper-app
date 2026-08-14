'use client';

import * as React from "react";
import { useRouter } from "next/navigation";
import { Building2, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CommonTable } from "@/components/ui/table";
import type { TablaLocal } from "@/hooks/useTablaLocal";
import type { Apartamento } from "../types";

export interface ApartamentosTablaProps {
  tabla: TablaLocal<Apartamento>;
  filtro: string;
  onFiltroChange: (valor: string) => void;
}

export function ApartamentosTabla({ tabla, filtro, onFiltroChange }: ApartamentosTablaProps) {
  const router = useRouter();

  const columnas = [
    {
      key: "numero_apartamento",
      label: "Apartamento",
      sortable: true,
      render: (apt: Apartamento) => (
        <span className="font-semibold text-zinc-900 dark:text-white">{apt.numero_apartamento}</span>
      ),
    },
    {
      key: "torre_id",
      label: "Torre",
      sortable: true,
      render: (apt: Apartamento) => apt.torres?.nombre ?? "Sin torre",
    },
    {
      key: "direccion",
      label: "Dirección",
      sortable: true,
      render: (apt: Apartamento) => (
        <span className="block max-w-[220px] truncate" title={apt.direccion}>
          {apt.direccion || "-"}
        </span>
      ),
    },
    {
      key: "ocupado",
      label: "Estado",
      sortable: true,
      render: (apt: Apartamento) => (
        <Badge variant={apt.ocupado ? "success" : "neutral"}>
          {apt.ocupado ? "Ocupado" : "Vacío"}
        </Badge>
      ),
    },
    {
      key: "acciones",
      label: "",
      render: (apt: Apartamento) => (
        <Button
          variant="ghost"
          size="sm"
          icon={<Eye className="w-3.5 h-3.5" />}
          onClick={() => router.push(`/admin/apartamentos/${apt.id}`)}
        >
          Ver detalle
        </Button>
      ),
    },
  ];

  const hayFiltro = Boolean(filtro.trim());

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-brand" />
          <span>Listado de apartamentos</span>
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
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-xs">
          <Input
            id="filtro-apartamento"
            placeholder="Buscar por número de apartamento…"
            value={filtro}
            onChange={(e) => onFiltroChange(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
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
            ? `Ningún apartamento coincide con "${filtro.trim()}".`
            : "Este conjunto todavía no tiene apartamentos registrados."
        }
      />
    </Card>
  );
}
