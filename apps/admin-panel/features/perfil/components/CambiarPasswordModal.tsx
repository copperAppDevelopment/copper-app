'use client';

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import { CodigoInput } from "@/components/ui/codigo-input";
import { useRecuperarPassword, MINIMO_PASSWORD } from "@/hooks/useRecuperarPassword";

export interface CambiarPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onCambiada: () => void;
}

export function CambiarPasswordModal({
  isOpen, onClose, email, onCambiada,
}: CambiarPasswordModalProps) {
  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [repetida, setRepetida] = useState("");

  const c = useRecuperarPassword(() => {
    onCambiada();
    cerrar();
  });

  const cerrar = () => {
    setCodigo("");
    setPassword("");
    setRepetida("");
    c.reiniciar();
    onClose();
  };

  const esSolicitud = c.paso === "solicitar";

  return (
    <Modal
      isOpen={isOpen}
      title="Cambiar contraseña"
      description={
        esSolicitud
          ? `Te enviaremos un código de 6 dígitos a ${email}.`
          : "Escribe el código y tu contraseña nueva."
      }
      onClose={cerrar}
      busy={c.loading}
      footer={
        <>
          <Button variant="outline" onClick={cerrar} disabled={c.loading}>Cancelar</Button>
          {esSolicitud ? (
            <Button onClick={() => c.solicitar(email)} loading={c.loading}>Enviar código</Button>
          ) : (
            <Button
              onClick={() => c.confirmar(codigo, password, repetida)}
              loading={c.loading}
              disabled={codigo.length !== 6 || !password || !repetida}
            >
              Cambiar contraseña
            </Button>
          )}
        </>
      }
    >
      {c.error && <Alert variant="danger">{c.error}</Alert>}

      {esSolicitud ? (
        <Alert variant="info">
          Al confirmar el código podrás escribir una contraseña nueva. Aquí seguirás con la
          sesión abierta.
        </Alert>
      ) : (
        <>
          <CodigoInput valor={codigo} onChange={setCodigo} disabled={c.loading} />
          <Input
            id="password-nueva"
            type="password"
            label="Contraseña nueva"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={c.loading}
            helperText={`Mínimo ${MINIMO_PASSWORD} caracteres.`}
          />
          <Input
            id="password-repetida"
            type="password"
            label="Repite la contraseña"
            value={repetida}
            onChange={(e) => setRepetida(e.target.value)}
            disabled={c.loading}
          />
        </>
      )}
    </Modal>
  );
}
