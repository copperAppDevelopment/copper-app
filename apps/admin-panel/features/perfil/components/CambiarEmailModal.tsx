'use client';

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import { useCambioEmail } from "../hooks/useCambioEmail";
import { CodigoInput } from "@/components/ui/codigo-input";

export interface CambiarEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailActual: string;
  onCambiado: () => void;
}

export function CambiarEmailModal({
  isOpen, onClose, emailActual, onCambiado,
}: CambiarEmailModalProps) {
  const [nuevo, setNuevo] = useState("");
  const [password, setPassword] = useState("");
  const [codigo, setCodigo] = useState("");

  const c = useCambioEmail(emailActual, () => {
    onCambiado();
    cerrar();
  });

  const cerrar = () => {
    setNuevo("");
    setPassword("");
    setCodigo("");
    c.reiniciar();
    onClose();
  };

  const esSolicitud = c.paso === "solicitar";

  return (
    <Modal
      isOpen={isOpen}
      title="Cambiar correo electrónico"
      description={
        esSolicitud
          ? "Te enviaremos un código de 6 dígitos al correo nuevo para confirmarlo."
          : `Escribe el código que enviamos a ${c.emailNuevo}.`
      }
      onClose={cerrar}
      busy={c.loading}
      footer={
        <>
          <Button variant="outline" onClick={cerrar} disabled={c.loading}>Cancelar</Button>
          {esSolicitud ? (
            <Button
              onClick={() => c.solicitar(nuevo, password)}
              loading={c.loading}
              disabled={!nuevo.trim() || !password}
            >
              Enviar código
            </Button>
          ) : (
            <Button
              onClick={() => c.confirmar(codigo)}
              loading={c.loading}
              disabled={codigo.length !== 6}
            >
              Confirmar
            </Button>
          )}
        </>
      }
    >
      {c.error && <Alert variant="danger">{c.error}</Alert>}

      {esSolicitud ? (
        <>
          <Input
            id="email-actual"
            label="Correo actual"
            value={emailActual}
            disabled
            readOnly
          />
          <Input
            id="email-nuevo"
            type="email"
            label="Correo nuevo"
            placeholder="nuevo@correo.com"
            value={nuevo}
            onChange={(e) => setNuevo(e.target.value)}
            disabled={c.loading}
          />
          <Input
            id="email-password"
            type="password"
            label="Tu contraseña actual"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={c.loading}
            helperText="La pedimos para confirmar que eres tú quien hace el cambio."
          />
        </>
      ) : (
        <>
          <CodigoInput valor={codigo} onChange={setCodigo} disabled={c.loading} />
          <button
            onClick={c.reiniciar}
            disabled={c.loading}
            className="w-full text-center text-xs text-zinc-500 dark:text-zinc-400 hover:text-brand cursor-pointer disabled:opacity-50"
          >
            Usar otro correo
          </button>
        </>
      )}
    </Modal>
  );
}
