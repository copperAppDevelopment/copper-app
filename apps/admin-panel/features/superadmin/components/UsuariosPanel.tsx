'use client';

import * as React from "react";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { SpinnerPagina } from "@/components/ui/spinner";
import { useUsuarios, type FiltroUsuario } from "../hooks/useUsuarios";
import { UsuariosKpis } from "./UsuariosKpis";
import { UsuariosTabla } from "./UsuariosTabla";
import { UsuarioDetalleModal } from "./UsuarioDetalleModal";
import type { UsuarioAdmin } from "../types";

export function UsuariosPanel({ sesionCargando }: { sesionCargando: boolean }) {
  const u = useUsuarios(sesionCargando);
  const [enDetalle, setEnDetalle] = useState<UsuarioAdmin | null>(null);

  if (u.loading) return <SpinnerPagina />;

  const conReinicio = (accion: () => void) => {
    accion();
    u.tabla.reiniciarPagina();
  };

  return (
    <div className="space-y-6">
      {u.error && <Alert variant="danger" onClose={() => u.setError("")}>{u.error}</Alert>}
      {u.aviso && <Alert variant="success" onClose={() => u.setAviso("")}>{u.aviso}</Alert>}

      <UsuariosKpis {...u.contadores} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <Input
            placeholder="Buscar por nombre, correo o documento"
            value={u.busqueda}
            onChange={e => conReinicio(() => u.setBusqueda(e.target.value))}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <Select
          value={u.filtro}
          onChange={e => conReinicio(() => u.setFiltro(e.target.value as FiltroUsuario))}
          options={u.opcionesFiltro}
        />
      </div>

      <UsuariosTabla u={u} onVer={setEnDetalle} />

      <UsuarioDetalleModal
        isOpen={Boolean(enDetalle)}
        usuario={enDetalle}
        conjuntos={enDetalle ? u.conjuntosDe(enDetalle.user_id) : []}
        onClose={() => setEnDetalle(null)}
        onVetar={u.vetar}
      />
    </div>
  );
}
