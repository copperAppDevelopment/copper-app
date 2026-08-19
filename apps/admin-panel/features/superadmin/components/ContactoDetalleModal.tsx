'use client';

import * as React from "react";
import { useState } from "react";
import { Check, X, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatoFecha } from "@/lib/formato";
import { varianteContacto, nombreContacto } from "@/lib/contactos";
import type { EstadoContacto } from "@/lib/contactos";
import type { Contacto } from "../types";

export interface ContactoDetalleModalProps {
  isOpen: boolean;
  contacto: Contacto | null;
  onClose: () => void;
  onMarcar: (contacto: Contacto, estado: EstadoContacto) => Promise<boolean>;
  onBorrar: (contacto: Contacto) => Promise<boolean>;
}

/** La ficha completa de una solicitud: es donde se lee la descripción y se gestiona. */
export function ContactoDetalleModal({
  isOpen, contacto, onClose, onMarcar, onBorrar,
}: ContactoDetalleModalProps) {
  const [ocupado, setOcupado] = useState(false);
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);

  if (!contacto) return null;

  const ejecutar = async (accion: () => Promise<boolean>) => {
    setOcupado(true);
    const bien = await accion();
    setOcupado(false);
    if (bien) onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        title={nombreContacto(contacto)}
        description={`${contacto.tipo_solicitud} · ${formatoFecha(contacto.created_at)}`}
        onClose={onClose}
        size="lg"
        busy={ocupado}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setConfirmarBorrado(true)}
              disabled={ocupado}
              icon={<Trash2 className="w-4 h-4" />}
            >
              Borrar
            </Button>
            <Button
              variant="secondary"
              onClick={() => ejecutar(() => onMarcar(contacto, "Rechazada"))}
              disabled={ocupado || contacto.estado === "Rechazada"}
              icon={<X className="w-4 h-4" />}
            >
              Rechazar
            </Button>
            <Button
              onClick={() => ejecutar(() => onMarcar(contacto, "Atendida"))}
              disabled={ocupado || contacto.estado === "Atendida"}
              icon={<Check className="w-4 h-4" />}
            >
              Marcar atendida
            </Button>
          </>
        }
      >
        <div className="flex items-center gap-2">
          <Badge variant={varianteContacto(contacto.estado)}>{contacto.estado}</Badge>
        </div>

        <dl className="text-sm space-y-2">
          <Linea etiqueta="Correo" valor={contacto.email} />
          <Linea etiqueta="Teléfono" valor={contacto.telefono || "—"} />
          <Linea etiqueta="Conjunto" valor={contacto.nombre_conjunto || "—"} />
        </dl>

        <div className="space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Lo que escribió
          </p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3">
            {contacto.descripcion || "Sin detalles"}
          </p>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={confirmarBorrado}
        title="¿Borrar la solicitud?"
        description={`Se elimina definitivamente la solicitud de ${nombreContacto(contacto)}. No hay forma de recuperarla.`}
        confirmText="Borrar"
        cancelText="Cancelar"
        onConfirm={async () => {
          setConfirmarBorrado(false);
          await ejecutar(() => onBorrar(contacto));
        }}
        onCancel={() => setConfirmarBorrado(false)}
        variant="danger"
        loading={ocupado}
      />
    </>
  );
}

function Linea({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-zinc-500 dark:text-zinc-400">{etiqueta}</dt>
      <dd className="font-semibold text-zinc-900 dark:text-white text-right break-all">{valor}</dd>
    </div>
  );
}
