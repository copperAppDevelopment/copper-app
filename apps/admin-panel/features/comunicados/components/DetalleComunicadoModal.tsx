'use client';

import * as React from "react";
import { useEffect, useState } from "react";
import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { formatoFecha } from "@/lib/formato";
import { dirigidoA } from "../types";
import type { Comunicado } from "../types";

export interface DetalleComunicadoModalProps {
  /** El comunicado a mostrar; `null` mantiene el modal cerrado. */
  comunicado: Comunicado | null;
  onClose: () => void;
  /** Debe lanzar si falla: el error se muestra aquí. */
  onAbrirAdjunto: (comunicadoId: string) => Promise<void>;
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 px-4 py-2.5">
      <dt className="shrink-0 text-zinc-500 dark:text-zinc-400">{etiqueta}</dt>
      <dd className="min-w-0 text-right font-semibold text-zinc-900 dark:text-white wrap-anywhere">{valor}</dd>
    </div>
  );
}

export function DetalleComunicadoModal({ comunicado, onClose, onAbrirAdjunto }: DetalleComunicadoModalProps) {
  const [abriendo, setAbriendo] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setError(""), [comunicado?.id]);

  if (!comunicado) return null;

  const abrir = async () => {
    setAbriendo(true);
    setError("");
    try {
      await onAbrirAdjunto(comunicado.id);
    } catch (err: any) {
      setError(err.message || "No se pudo abrir el adjunto.");
    } finally {
      setAbriendo(false);
    }
  };

  return (
    <Modal
      isOpen
      title={comunicado.titulo}
      description={`Publicado el ${formatoFecha(comunicado.fecha_publicacion)}`}
      onClose={onClose}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cerrar</Button>
          {comunicado.adjunto && (
            <Button onClick={abrir} loading={abriendo} icon={<Paperclip className="w-4 h-4" />}>
              Abrir adjunto
            </Button>
          )}
        </>
      }
    >
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="flex flex-wrap gap-1.5">
        <Badge variant={comunicado.tipo === "Reporte" ? "warning" : "brand"}>{comunicado.tipo}</Badge>
        <Badge variant="neutral">{comunicado.tipo_novedad}</Badge>
      </div>

      <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line wrap-anywhere">
        {comunicado.descripcion || "Sin descripción."}
      </p>

      <dl className="rounded-xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
        <Dato etiqueta="Dirigido a" valor={dirigidoA(comunicado)} />
        <Dato
          etiqueta="Enviado a"
          valor={
            comunicado.destinatarios > 0
              ? `${comunicado.destinatarios} ${comunicado.destinatarios === 1 ? "residente" : "residentes"}`
              // Sin notificación puede ser que no hubiera residentes activos, o que se haya
              // borrado después (la tabla `notifications` se vació en septiembre de 2026).
              : "Sin notificación registrada"
          }
        />
        <Dato etiqueta="Publicado por" valor={comunicado.autor_nombre ?? "—"} />
      </dl>
    </Modal>
  );
}
