'use client';

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { TIPOS_DOCUMENTO, MIN_PASSWORD } from "../types";
import type { EstadoRegistro } from "../hooks/useRegistro";

/** Paso 1: los datos de quien va a administrar. */
export function CuentaForm({ r }: { r: EstadoRegistro }) {
  return (
    <div className="space-y-4">
      {r.error && <Alert variant="danger">{r.error}</Alert>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nombres"
          value={r.form.nombres}
          onChange={e => r.cambiar("nombres", e.target.value)}
          disabled={r.enviando}
        />
        <Input
          label="Apellidos"
          value={r.form.apellidos}
          onChange={e => r.cambiar("apellidos", e.target.value)}
          disabled={r.enviando}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Tipo de documento"
          value={r.form.tipo_documento}
          onChange={e => r.cambiar("tipo_documento", e.target.value)}
          disabled={r.enviando}
          options={TIPOS_DOCUMENTO}
        />
        <Input
          label="Número de documento"
          value={r.form.documento}
          onChange={e => r.cambiar("documento", e.target.value)}
          disabled={r.enviando}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          value={r.form.email}
          onChange={e => r.cambiar("email", e.target.value)}
          disabled={r.enviando}
          helperText="Con este correo entrarás al panel."
        />
        <Input
          label="Teléfono"
          value={r.form.telefono}
          onChange={e => r.cambiar("telefono", e.target.value)}
          disabled={r.enviando}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          value={r.form.contrasena}
          onChange={e => r.cambiar("contrasena", e.target.value)}
          disabled={r.enviando}
          helperText={`Mínimo ${MIN_PASSWORD} caracteres.`}
        />
        <Input
          label="Repite la contraseña"
          type="password"
          autoComplete="new-password"
          value={r.form.confirmacion}
          onChange={e => r.cambiar("confirmacion", e.target.value)}
          disabled={r.enviando}
        />
      </div>

      {/* La trampa: oculta para una persona, visible para un bot que rellena todo. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={r.form.website}
        onChange={e => r.cambiar("website", e.target.value)}
        className="hidden"
      />

      <div className="flex justify-end pt-2">
        <Button
          onClick={r.crearCuenta}
          loading={r.enviando}
          disabled={Boolean(r.motivo)}
          icon={<ArrowRight className="w-4 h-4" />}
          iconPosition="right"
        >
          Crear cuenta y continuar
        </Button>
      </div>
    </div>
  );
}
