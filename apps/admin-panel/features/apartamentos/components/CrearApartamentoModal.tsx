'use client';

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import type { Torre } from "../types";

export interface CrearApartamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  conjuntoNombre: string;
  torres: Torre[];
  onCrear: (payload: { numero_apartamento: string; direccion: string; torre_id: string }) => Promise<void>;
}

export function CrearApartamentoModal({
  isOpen, onClose, conjuntoNombre, torres, onCrear,
}: CrearApartamentoModalProps) {
  const [numero, setNumero] = useState("");
  const [direccion, setDireccion] = useState("");
  const [torreId, setTorreId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cerrar = () => {
    setNumero(""); setDireccion(""); setTorreId(""); setError("");
    onClose();
  };

  const enviar = async () => {
    setLoading(true);
    setError("");
    try {
      await onCrear({ numero_apartamento: numero, direccion, torre_id: torreId });
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
      title="Agregar apartamento"
      description={`Se creará en ${conjuntoNombre}.`}
      onClose={cerrar}
      busy={loading}
      footer={
        <>
          <Button variant="outline" onClick={cerrar} disabled={loading}>Cancelar</Button>
          <Button onClick={enviar} loading={loading}>Crear apartamento</Button>
        </>
      }
    >
      {error && <Alert variant="danger">{error}</Alert>}

      <Input
        id="nuevo-numero"
        label="Número de apartamento"
        placeholder="Ej. 302"
        value={numero}
        maxLength={20}
        onChange={(e) => setNumero(e.target.value)}
        helperText="Máximo 20 caracteres. Debe ser único dentro del conjunto."
      />

      <Input
        id="nueva-direccion"
        label="Dirección"
        placeholder="Ej. Torre A - Apto 302"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
      />

      {torres.length > 0 && (
        <Select
          id="nueva-torre"
          label="Torre (opcional)"
          value={torreId}
          onChange={(e) => setTorreId(e.target.value)}
          options={[
            { value: "", label: "Sin torre" },
            ...torres.map(t => ({ value: t.id, label: t.nombre })),
          ]}
        />
      )}
    </Modal>
  );
}
