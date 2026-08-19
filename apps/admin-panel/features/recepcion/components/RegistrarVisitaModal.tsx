'use client';

import * as React from "react";
import { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import { VISITA_VACIA } from "../types";
import type { NuevaVisita } from "../types";

export interface RegistrarVisitaModalProps {
  isOpen: boolean;
  opcionesApartamento: { value: string; label: string }[];
  enviando: boolean;
  onClose: () => void;
  onRegistrar: (payload: NuevaVisita) => Promise<unknown>;
}

export function RegistrarVisitaModal({
  isOpen, opcionesApartamento, enviando, onClose, onRegistrar,
}: RegistrarVisitaModalProps) {
  const [form, setForm] = useState<NuevaVisita>(VISITA_VACIA);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setForm(VISITA_VACIA);
    setError("");
  }, [isOpen]);

  const cambiar = <K extends keyof NuevaVisita>(clave: K, valor: NuevaVisita[K]) =>
    setForm(previo => ({ ...previo, [clave]: valor }));

  const guardar = async () => {
    setError("");
    try {
      await onRegistrar(form);
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const completo = Boolean(form.apartamento_id && form.nombres.trim());

  return (
    <Modal
      isOpen={isOpen}
      title="Registrar visita"
      description="Al guardar, los residentes del apartamento reciben una notificación para autorizarla."
      onClose={onClose}
      busy={enviando}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={enviando}>Cancelar</Button>
          <Button
            onClick={guardar}
            loading={enviando}
            disabled={!completo}
            icon={<UserPlus className="w-4 h-4" />}
          >
            Registrar
          </Button>
        </>
      }
    >
      {error && <Alert variant="danger">{error}</Alert>}

      <Select
        id="visita-apartamento"
        label="Apartamento"
        value={form.apartamento_id}
        onChange={(e) => cambiar("apartamento_id", e.target.value)}
        disabled={enviando}
        options={[{ value: "", label: "Selecciona un apartamento" }, ...opcionesApartamento]}
      />

      <Input
        id="visita-nombres"
        label="Nombre del visitante"
        placeholder="Ana Gómez"
        value={form.nombres}
        onChange={(e) => cambiar("nombres", e.target.value)}
        disabled={enviando}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="visita-telefono"
          label="Teléfono"
          placeholder="3001234567"
          value={form.telefono}
          onChange={(e) => cambiar("telefono", e.target.value)}
          disabled={enviando}
        />

        <Input
          id="visita-motivo"
          label="Motivo"
          placeholder="Visita familiar"
          value={form.motivo}
          onChange={(e) => cambiar("motivo", e.target.value)}
          disabled={enviando}
        />
      </div>

      <Input
        id="visita-observaciones"
        label="Observaciones"
        placeholder="Opcional"
        value={form.observaciones}
        onChange={(e) => cambiar("observaciones", e.target.value)}
        disabled={enviando}
      />
    </Modal>
  );
}
