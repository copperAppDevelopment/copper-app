'use client';

import * as React from "react";
import { useState } from "react";
import { Save, Mail, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { usePerfil } from "../hooks/usePerfil";
import { PerfilFoto } from "./PerfilFoto";
import { CambiarEmailModal } from "./CambiarEmailModal";
import { CambiarPasswordModal } from "./CambiarPasswordModal";
import { TIPOS_DOCUMENTO } from "../types";

export function PerfilDatosForm() {
  const p = usePerfil();
  const [emailAbierto, setEmailAbierto] = useState(false);
  const [passwordAbierto, setPasswordAbierto] = useState(false);
  const [avisoCuenta, setAvisoCuenta] = useState("");

  if (p.loading) {
    return <Card className="shadow-sm"><p className="text-sm text-zinc-500">Cargando…</p></Card>;
  }

  const nombreCompleto = `${p.form.nombres} ${p.form.apellidos}`.trim();

  return (
    <div className="space-y-6">
      {p.error && <Alert variant="danger">{p.error}</Alert>}
      {p.exito && <Alert variant="success">{p.exito}</Alert>}
      {avisoCuenta && <Alert variant="success">{avisoCuenta}</Alert>}

      <Card title="Datos personales" className="shadow-sm">
        <div className="space-y-5">
          <PerfilFoto
            fotoUrl={p.perfil?.foto_url ?? null}
            foto={p.foto}
            nombre={nombreCompleto}
            onElegir={p.setFoto}
            disabled={p.guardando}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="perfil-nombres"
              label="Nombres"
              value={p.form.nombres}
              onChange={(e) => p.cambiar("nombres", e.target.value)}
              disabled={p.guardando}
            />
            <Input
              id="perfil-apellidos"
              label="Apellidos"
              value={p.form.apellidos}
              onChange={(e) => p.cambiar("apellidos", e.target.value)}
              disabled={p.guardando}
            />
            <Select
              id="perfil-tipo-doc"
              label="Tipo de documento"
              value={p.form.tipo_documento}
              onChange={(e) => p.cambiar("tipo_documento", e.target.value)}
              options={TIPOS_DOCUMENTO}
              disabled={p.guardando}
            />
            <Input
              id="perfil-documento"
              label="Número de documento"
              value={p.form.documento}
              onChange={(e) => p.cambiar("documento", e.target.value)}
              disabled={p.guardando}
            />
            <Input
              id="perfil-telefono"
              label="Teléfono"
              value={p.form.phone_number}
              onChange={(e) => p.cambiar("phone_number", e.target.value)}
              disabled={p.guardando}
            />
            <Input
              id="perfil-direccion"
              label="Dirección"
              value={p.form.direccion}
              onChange={(e) => p.cambiar("direccion", e.target.value)}
              disabled={p.guardando}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={p.guardar} loading={p.guardando} icon={<Save className="w-4 h-4" />}>
              Guardar cambios
            </Button>
          </div>
        </div>
      </Card>

      <Card title="Cuenta" subtitle="El correo y la contraseña se cambian con un código de verificación." className="shadow-sm">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Correo electrónico
              </p>
              <p className="text-sm text-zinc-800 dark:text-zinc-100">{p.perfil?.email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEmailAbierto(true)}
              icon={<Mail className="w-3.5 h-3.5" />}
            >
              Cambiar correo
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Contraseña
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">••••••••</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPasswordAbierto(true)}
              icon={<KeyRound className="w-3.5 h-3.5" />}
            >
              Cambiar contraseña
            </Button>
          </div>
        </div>
      </Card>

      <CambiarEmailModal
        isOpen={emailAbierto}
        onClose={() => setEmailAbierto(false)}
        emailActual={p.perfil?.email ?? ""}
        onCambiado={() => {
          setAvisoCuenta("Tu correo se actualizó correctamente.");
          p.recargar();
        }}
      />

      <CambiarPasswordModal
        isOpen={passwordAbierto}
        onClose={() => setPasswordAbierto(false)}
        email={p.perfil?.email ?? ""}
        onCambiada={() => setAvisoCuenta("Tu contraseña se actualizó correctamente.")}
      />
    </div>
  );
}
