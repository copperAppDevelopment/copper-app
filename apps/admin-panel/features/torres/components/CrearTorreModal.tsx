'use client';

import * as React from "react";
import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import { TorreCamposForm } from "@/components/torres/TorreCamposForm";
import { TORRE_VACIA, validarBorrador } from "@/lib/torres";
import type { BorradorTorre } from "@/lib/torres";

export interface CrearTorreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCrear: (borradores: BorradorTorre[]) => Promise<void>;
}

export function CrearTorreModal({ isOpen, onClose, onCrear }: CrearTorreModalProps) {
  const [borrador, setBorrador] = useState<BorradorTorre>(TORRE_VACIA);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setBorrador(TORRE_VACIA);
    setError("");
  }, [isOpen]);

  const guardar = async () => {
    const motivo = validarBorrador(borrador);
    if (motivo) {
      setError(motivo);
      return;
    }

    setLoading(true);
    setError("");
    try {
      await onCrear([borrador]);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Nueva torre"
      description="Se crean la torre, sus pisos y sus apartamentos de una vez."
      onClose={onClose}
      busy={loading}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button onClick={guardar} loading={loading} icon={<Save className="w-4 h-4" />}>
            Crear torre
          </Button>
        </>
      }
    >
      {error && <Alert variant="danger">{error}</Alert>}

      <TorreCamposForm
        borrador={borrador}
        onCambiar={setBorrador}
        disabled={loading}
      />
    </Modal>
  );
}
