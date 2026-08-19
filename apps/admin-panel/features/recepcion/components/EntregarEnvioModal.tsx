'use client';

import * as React from "react";
import { useState, useEffect } from "react";
import { PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import type { EnvioRecepcion } from "../types";

export interface EntregarEnvioModalProps {
  envio: EnvioRecepcion | null;
  enviando: boolean;
  onClose: () => void;
  onEntregar: (envioId: string, recibidoPor: string) => Promise<unknown>;
}

/** Entrega del paquete: se pide quién lo recibe, que es lo que convierte esto en bitácora. */
export function EntregarEnvioModal({
  envio, enviando, onClose, onEntregar,
}: EntregarEnvioModalProps) {
  const [recibidoPor, setRecibidoPor] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!envio) return;
    setRecibidoPor("");
    setError("");
  }, [envio]);

  const guardar = async () => {
    if (!envio) return;
    setError("");
    try {
      await onEntregar(envio.id, recibidoPor);
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Modal
      isOpen={Boolean(envio)}
      title="Entregar paquete"
      description={envio ? `${envio.empresa_mensajeria} · ${envio.label_apartamento}` : ""}
      onClose={onClose}
      busy={enviando}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={enviando}>Cancelar</Button>
          <Button
            onClick={guardar}
            loading={enviando}
            disabled={!recibidoPor.trim()}
            icon={<PackageCheck className="w-4 h-4" />}
          >
            Marcar entregado
          </Button>
        </>
      }
    >
      {error && <Alert variant="danger">{error}</Alert>}

      <Input
        id="envio-recibido-por"
        label="Recibido por"
        placeholder="Nombre de quien lo recoge"
        value={recibidoPor}
        onChange={(e) => setRecibidoPor(e.target.value)}
        disabled={enviando}
        helperText="Queda registrado junto con la fecha y quién lo entregó."
      />
    </Modal>
  );
}
