'use client';

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommonTable, type TableColumn } from "@/components/ui/table";
import { formatoFecha } from "@/lib/formato";
import { varianteContacto, nombreContacto } from "@/lib/contactos";
import type { Contacto } from "../types";
import type { EstadoContactos } from "../hooks/useContactos";

export interface ContactosTablaProps {
  c: EstadoContactos;
  onVer: (contacto: Contacto) => void;
}

export function ContactosTabla({ c, onVer }: ContactosTablaProps) {
  const columnas: TableColumn<Contacto>[] = [
    {
      key: "created_at",
      label: "Fecha",
      sortable: true,
      render: f => formatoFecha(f.created_at),
    },
    {
      key: "nombre",
      label: "Quién escribe",
      sortable: true,
      render: f => (
        <div className="min-w-0">
          <p className="font-semibold text-zinc-900 dark:text-white">{nombreContacto(f)}</p>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">{f.email}</p>
        </div>
      ),
    },
    {
      key: "nombre_conjunto",
      label: "Conjunto",
      sortable: true,
      render: f => f.nombre_conjunto || "—",
    },
    {
      key: "tipo_solicitud",
      label: "Tipo",
      sortable: true,
    },
    {
      key: "estado",
      label: "Estado",
      sortable: true,
      render: f => <Badge variant={varianteContacto(f.estado)}>{f.estado}</Badge>,
    },
    {
      key: "acciones",
      label: "",
      // La descripción no cabe en una celda: se lee entera en la ficha.
      render: f => (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => onVer(f)}>
            Ver
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card
      title="Solicitudes"
      subtitle="Lo que llega por el formulario de la página web"
      className="shadow-sm"
      noPadding
    >
      <CommonTable
        columns={columnas}
        data={c.tabla.datos}
        sortBy={c.tabla.sortBy}
        sortOrder={c.tabla.sortOrder}
        onSort={c.tabla.handleSort}
        currentPage={c.tabla.currentPage}
        pageSize={c.tabla.pageSize}
        totalRows={c.tabla.totalRows}
        onPageChange={c.tabla.setCurrentPage}
        emptyMessage="No hay solicitudes que coincidan con la búsqueda"
      />
    </Card>
  );
}
