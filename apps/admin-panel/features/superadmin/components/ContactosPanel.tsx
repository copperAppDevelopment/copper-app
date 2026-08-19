'use client';

import * as React from "react";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { SpinnerPagina } from "@/components/ui/spinner";
import { useContactos } from "../hooks/useContactos";
import { ContactosKpis } from "./ContactosKpis";
import { ContactosTabla } from "./ContactosTabla";
import { ContactoDetalleModal } from "./ContactoDetalleModal";
import type { Contacto } from "../types";

export function ContactosPanel({ sesionCargando }: { sesionCargando: boolean }) {
  const c = useContactos(sesionCargando);
  const [enDetalle, setEnDetalle] = useState<Contacto | null>(null);

  if (c.loading) return <SpinnerPagina />;

  const conReinicio = (accion: () => void) => {
    accion();
    c.tabla.reiniciarPagina();
  };

  return (
    <div className="space-y-6">
      {c.error && <Alert variant="danger" onClose={() => c.setError("")}>{c.error}</Alert>}
      {c.aviso && <Alert variant="success" onClose={() => c.setAviso("")}>{c.aviso}</Alert>}

      <ContactosKpis {...c.contadores} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          placeholder="Buscar por nombre, correo o conjunto"
          value={c.busqueda}
          onChange={e => conReinicio(() => c.setBusqueda(e.target.value))}
          leftIcon={<Search className="w-4 h-4" />}
        />
        <Select
          value={c.estado}
          onChange={e => conReinicio(() => c.setEstado(e.target.value))}
          options={c.opcionesEstado}
        />
        <Select
          value={c.tipo}
          onChange={e => conReinicio(() => c.setTipo(e.target.value))}
          options={c.opcionesTipo}
        />
      </div>

      <ContactosTabla c={c} onVer={setEnDetalle} />

      <ContactoDetalleModal
        isOpen={Boolean(enDetalle)}
        contacto={enDetalle}
        onClose={() => setEnDetalle(null)}
        onMarcar={c.marcar}
        onBorrar={c.borrar}
      />
    </div>
  );
}
