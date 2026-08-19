'use client';

import * as React from "react";
import { useState, useEffect } from "react";
import { PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import { ENVIO_VACIO } from "../types";
import type { NuevoEnvio } from "../types";

export interface RegistrarEnvioModalProps {
  isOpen: boolean;
  opcionesApartamento: { value: string; label: string }[];
  enviando: boolean;
  onClose: () => void;
  onRegistrar: (payload: NuevoEnvio) => Promise<unknown>;
}

export function RegistrarEnvioModal({
  isOpen, opcionesApartamento, enviando, onClose, onRegistrar,
}: RegistrarEnvioModalProps) {
  const [form, setForm] = useState<NuevoEnvio>(ENVIO_VACIO);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setForm(ENVIO_VACIO);
    setError("");
  }, [isOpen]);

  const cambiar = <K extends keyof NuevoEnvio>(clave: K, valor: NuevoEnvio[K]) =>
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

  const completo = Boolean(form.apartamento_id && form.empresa_mensajeria.trim());

  return (
    <Modal
      isOpen={isOpen}
      title="Registrar envío"
      description="El paquete queda por entregar y los residentes reciben una notificación."
      onClose={onClose}
      busy={enviando}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={enviando}>Cancelar</Button>
          <Button
            onClick={guardar}
            loading={enviando}
            disabled={!completo}
            icon={<PackagePlus className="w-4 h-4" />}
          >
            Registrar
          </Button>
        </>
      }
    >
      {error && <Alert variant="danger">{error}</Alert>}

      <Select
        id="envio-apartamento"
        label="Apartamento"
        value={form.apartamento_id}
        onChange={(e) => cambiar("apartamento_id", e.target.value)}
        disabled={enviando}
        options={[{ value: "", label: "Selecciona un apartamento" }, ...opcionesApartamento]}
      />

      <Input
        id="envio-empresa"
        label="Empresa de mensajería"
        placeholder="Servientrega"
        value={form.empresa_mensajeria}
        onChange={(e) => cambiar("empresa_mensajeria", e.target.value)}
        disabled={enviando}
      />

      <Input
        id="envio-observaciones"
        label="Observaciones"
        placeholder="Caja grande, guía 123456"
        value={form.observaciones}
        onChange={(e) => cambiar("observaciones", e.target.value)}
        disabled={enviando}
      />
    </Modal>
  );
}
