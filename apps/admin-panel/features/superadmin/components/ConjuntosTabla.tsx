'use client';

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommonTable, type TableColumn } from "@/components/ui/table";
import { formatoFecha } from "@/lib/formato";
import { etiquetaSuscripcion, varianteSuscripcion } from "@/lib/suscripciones";
import type { ConjuntoSuper } from "../types";
import type { EstadoConjuntosSuper } from "../hooks/useConjuntosSuper";

export interface ConjuntosTablaProps {
  c: EstadoConjuntosSuper;
  onCambiarActivo: (conjunto: ConjuntoSuper) => void;
}

export function ConjuntosTabla({ c, onCambiarActivo }: ConjuntosTablaProps) {
  const router = useRouter();

  const columnas: TableColumn<ConjuntoSuper>[] = [
    {
      key: "nombre_conjunto",
      label: "Conjunto",
      sortable: true,
      render: f => (
        <div className="min-w-0">
          <p className="font-semibold text-zinc-900 dark:text-white">{f.nombre_conjunto}</p>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
            {f.ciudad || "Sin ciudad"}
          </p>
        </div>
      ),
    },
    {
      key: "propietario_nombre",
      label: "Administrador",
      sortable: true,
      render: f => f.propietario_nombre || "Sin propietario",
    },
    {
      key: "num_apartamentos",
      label: "Aptos.",
      sortable: true,
    },
    {
      key: "num_residentes",
      label: "Residentes",
      sortable: true,
    },
    {
      key: "nombre_plan",
      label: "Plan",
      sortable: true,
      render: f =>
        f.suscripcion_id ? (
          <div>
            <p className="font-semibold">{f.nombre_plan}</p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              {formatoFecha(f.fecha_fin)}
            </p>
          </div>
        ) : (
          <span className="text-zinc-400 dark:text-zinc-500">Sin plan</span>
        ),
    },
    {
      key: "estado_suscripcion",
      label: "Suscripción",
      sortable: true,
      render: f =>
        f.suscripcion_id ? (
          <Badge variant={varianteSuscripcion(f.estado_suscripcion)}>
            {etiquetaSuscripcion(f.estado_suscripcion)}
          </Badge>
        ) : (
          <Badge variant="neutral">Ninguna</Badge>
        ),
    },
    {
      key: "activo",
      label: "Acceso",
      sortable: true,
      render: f =>
        f.activo ? (
          <Badge variant="success">Activo</Badge>
        ) : (
          <Badge variant="danger">{f.vetado ? "Desactivado" : "Sin activar"}</Badge>
        ),
    },
    {
      key: "acciones",
      label: "",
      render: f => (
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/superadmin/conjuntos/${f.conjunto_id}`)}
          >
            Ver
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onCambiarActivo(f)}>
            {f.activo ? "Desactivar" : "Activar"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card
      title="Conjuntos"
      subtitle="Desactivar uno le quita el acceso a la app a todos sus residentes"
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
        emptyMessage="No hay conjuntos que coincidan con la búsqueda"
      />
    </Card>
  );
}
