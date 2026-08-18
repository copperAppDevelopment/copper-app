'use client';

import * as React from "react";
import { useState } from "react";
import { UserPlus, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import { OPCIONES_ROL, ETIQUETA_ROL } from "@/lib/equipo";
import { TIPOS_DOCUMENTO } from "../types";
import type { RolEquipo } from "@/lib/equipo";
import type { NuevoMiembro, UsuarioExistenteEquipo } from "../conjuntosTypes";

const VACIO: NuevoMiembro = {
  email: "",
  rol: "Recepcion",
  nombres: "",
  apellidos: "",
  tipo_documento: "CC",
  numero_documento: "",
  telefono: "",
};

export interface InvitarMiembroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvitar: (payload: NuevoMiembro) =>
    Promise<{ usuarioExistente: UsuarioExistenteEquipo | null; mensaje: string | null }>;
  onVincular: (userId: string, rol: RolEquipo) => Promise<void>;
}

export function InvitarMiembroModal({
  isOpen, onClose, onInvitar, onVincular,
}: InvitarMiembroModalProps) {
  const [form, setForm] = useState<NuevoMiembro>(VACIO);
  const [existente, setExistente] = useState<UsuarioExistenteEquipo | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const cambiar = <K extends keyof NuevoMiembro>(campo: K, valor: NuevoMiembro[K]) => {
    setForm(previo => ({ ...previo, [campo]: valor }));
    setMensaje("");
  };

  const cerrar = () => {
    setForm(VACIO);
    setExistente(null);
    setMensaje("");
    setError("");
    onClose();
  };

  const invitar = async () => {
    setLoading(true);
    setError("");
    setMensaje("");
    try {
      const res = await onInvitar(form);
      if (res.usuarioExistente) {
        setExistente(res.usuarioExistente);
      } else {
        setMensaje(res.mensaje ?? "Invitación enviada.");
        setForm(VACIO);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const vincular = async () => {
    if (!existente) return;
    setLoading(true);
    setError("");
    try {
      await onVincular(existente.id, form.rol);
      cerrar();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const completo =
    form.email.trim() && form.nombres.trim() && form.apellidos.trim() && form.numero_documento.trim();

  return (
    <Modal
      isOpen={isOpen}
      title="Invitar al equipo"
      description="Se le enviará un correo con un enlace para crear su cuenta."
      onClose={cerrar}
      busy={loading}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={cerrar} disabled={loading}>Cerrar</Button>
          {existente ? (
            <Button onClick={vincular} loading={loading} icon={<Link2 className="w-4 h-4" />}>
              Añadir al equipo
            </Button>
          ) : (
            <Button
              onClick={invitar}
              loading={loading}
              disabled={!completo}
              icon={<UserPlus className="w-4 h-4" />}
            >
              Enviar invitación
            </Button>
          )}
        </>
      }
    >
      {error && <Alert variant="danger">{error}</Alert>}
      {mensaje && <Alert variant="success">{mensaje}</Alert>}

      {existente ? (
        <Alert variant="info" title="Este correo ya tiene cuenta">
          {[existente.nombres, existente.apellidos].filter(Boolean).join(" ") || existente.email} ya
          está registrado en Copper. No hace falta invitarlo: puedes añadirlo directamente al equipo
          como <strong>{ETIQUETA_ROL[form.rol]}</strong>.
        </Alert>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="equipo-email"
              type="email"
              label="Correo electrónico"
              placeholder="persona@correo.com"
              value={form.email}
              onChange={(e) => cambiar("email", e.target.value)}
              disabled={loading}
            />
            <Select
              id="equipo-rol"
              label="Rol"
              value={form.rol}
              onChange={(e) => cambiar("rol", e.target.value as RolEquipo)}
              options={OPCIONES_ROL}
              disabled={loading}
            />
            <Input
              id="equipo-nombres"
              label="Nombres"
              value={form.nombres}
              onChange={(e) => cambiar("nombres", e.target.value)}
              disabled={loading}
            />
            <Input
              id="equipo-apellidos"
              label="Apellidos"
              value={form.apellidos}
              onChange={(e) => cambiar("apellidos", e.target.value)}
              disabled={loading}
            />
            <Select
              id="equipo-tipo-doc"
              label="Tipo de documento"
              value={form.tipo_documento}
              onChange={(e) => cambiar("tipo_documento", e.target.value)}
              options={TIPOS_DOCUMENTO}
              disabled={loading}
            />
            <Input
              id="equipo-documento"
              label="Número de documento"
              value={form.numero_documento}
              onChange={(e) => cambiar("numero_documento", e.target.value)}
              disabled={loading}
            />
            <Input
              id="equipo-telefono"
              label="Teléfono (opcional)"
              value={form.telefono}
              onChange={(e) => cambiar("telefono", e.target.value)}
              disabled={loading}
            />
          </div>

          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
            El enlace de invitación caduca a los 7 días.
          </p>
        </>
      )}
    </Modal>
  );
}
