'use client';

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommonTable, type TableColumn } from "@/components/ui/table";
import { formatoFecha } from "@/lib/formato";
import type { UsuarioAdmin } from "../types";
import type { EstadoUsuarios } from "../hooks/useUsuarios";

export interface UsuariosTablaProps {
  u: EstadoUsuarios;
  onVer: (usuario: UsuarioAdmin) => void;
}

/** Un vetado y una cuenta que nunca se activó se ven igual si solo se mira `estado`. */
function insignia(usuario: UsuarioAdmin) {
  if (usuario.cuenta_bloqueada) return <Badge variant="danger">Vetado</Badge>;
  if (!usuario.estado) return <Badge variant="neutral">Inactivo</Badge>;
  return <Badge variant="success">Con acceso</Badge>;
}

export function UsuariosTabla({ u, onVer }: UsuariosTablaProps) {
  const columnas: TableColumn<UsuarioAdmin>[] = [
    {
      key: "nombre_completo",
      label: "Administrador",
      sortable: true,
      render: f => (
        <div className="min-w-0">
          <p className="font-semibold text-zinc-900 dark:text-white">
            {f.nombre_completo || "Sin nombre"}
          </p>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">{f.email}</p>
        </div>
      ),
    },
    {
      key: "total_conjuntos",
      label: "Conjuntos",
      sortable: true,
      render: f =>
        f.total_conjuntos > 0 ? (
          <span className="font-semibold">{f.total_conjuntos}</span>
        ) : (
          <span className="text-zinc-400 dark:text-zinc-500">Ninguno</span>
        ),
    },
    {
      key: "ultimo_login",
      label: "Último acceso",
      sortable: true,
      render: f => (f.ultimo_login ? formatoFecha(f.ultimo_login) : "Nunca entró"),
    },
    {
      key: "estado",
      label: "Estado",
      sortable: true,
      render: insignia,
    },
    {
      key: "acciones",
      label: "",
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
      title="Administradores"
      subtitle="Quién administra qué, y quién puede entrar"
      className="shadow-sm"
      noPadding
    >
      <CommonTable
        columns={columnas}
        data={u.tabla.datos}
        sortBy={u.tabla.sortBy}
        sortOrder={u.tabla.sortOrder}
        onSort={u.tabla.handleSort}
        currentPage={u.tabla.currentPage}
        pageSize={u.tabla.pageSize}
        totalRows={u.tabla.totalRows}
        onPageChange={u.tabla.setCurrentPage}
        emptyMessage="No hay administradores que coincidan con la búsqueda"
      />
    </Card>
  );
}
