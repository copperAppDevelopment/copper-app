'use client';

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import { nombreCompleto } from "@/lib/formato";
import type { UsuarioExistente } from "../types";

export interface InvitarResidenteModalProps {
  isOpen: boolean;
  onClose: () => void;
  conjuntoNombre: string;
  opcionesApartamento: { value: string; label: string }[];
  onInvitar: (payload: { email: string; telefono: string; apartamento_id: string }) =>
    Promise<{ usuarioExistente: UsuarioExistente | null; mensaje: string | null }>;
  onVincular: (userId: string, apartamentoId: string) => Promise<void>;
}

/**
 * La edge function `invite-user` no distingue entre un correo nuevo y uno ya registrado.
 * Esa distinción la hace la route, y este modal presenta las dos salidas: invitar, o
 * vincular directamente al conjunto si la cuenta ya existe.
 */
export function InvitarResidenteModal({
  isOpen, onClose, conjuntoNombre, opcionesApartamento, onInvitar, onVincular,
}: InvitarResidenteModalProps) {
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [apartamentoId, setApartamentoId] = useState("");
  const [existente, setExistente] = useState<UsuarioExistente | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const cerrar = () => {
    setEmail(""); setTelefono(""); setApartamentoId("");
    setExistente(null); setError(""); setOk("");
    onClose();
  };

  const invitar = async () => {
    setLoading(true); setError(""); setOk("");
    try {
      const res = await onInvitar({ email, telefono, apartamento_id: apartamentoId });
      if (res.usuarioExistente) {
        setExistente(res.usuarioExistente);
      } else {
        setOk(res.mensaje ?? "");
        setEmail(""); setTelefono(""); setApartamentoId("");
      }
    } catch (err: any) {
      setError(err.message);
      setExistente(null);
    } finally {
      setLoading(false);
    }
  };

  const vincular = async () => {
    if (!existente) return;
    setLoading(true); setError("");
    try {
      await onVincular(existente.id, apartamentoId);
      cerrar();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Invitar residente"
      description={`Se enviará una invitación por correo para unirse a ${conjuntoNombre}.`}
      onClose={cerrar}
      busy={loading}
      footer={
        existente ? (
          <>
            <Button variant="outline" onClick={cerrar} disabled={loading}>Cancelar</Button>
            <Button onClick={vincular} loading={loading}>Vincular al conjunto</Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={cerrar} disabled={loading}>Cerrar</Button>
            <Button onClick={invitar} loading={loading}>Enviar invitación</Button>
          </>
        )
      }
    >
      {error && <Alert variant="danger">{error}</Alert>}
      {ok && <Alert variant="success">{ok}</Alert>}

      {existente && (
        <Alert variant="info" title="Este correo ya tiene cuenta">
          {nombreCompleto(existente, existente.email ?? "El usuario")} ya está registrado en Copper.
          No hace falta invitarlo: puedes vincularlo directamente a este conjunto.
        </Alert>
      )}

      <Input
        id="inv-email"
        label="Correo electrónico"
        type="email"
        placeholder="residente@correo.com"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setExistente(null); }}
        disabled={Boolean(existente)}
      />

      {!existente && (
        <Input
          id="inv-telefono"
          label="Teléfono (opcional)"
          placeholder="300 000 0000"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
      )}

      <Select
        id="inv-apartamento"
        label="Apartamento (opcional)"
        value={apartamentoId}
        onChange={(e) => setApartamentoId(e.target.value)}
        options={opcionesApartamento}
        helperText="Puedes dejarlo sin asignar y hacerlo más tarde desde la tabla."
      />
    </Modal>
  );
}
