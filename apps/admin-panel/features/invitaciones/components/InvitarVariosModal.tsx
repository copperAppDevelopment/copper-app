'use client';

import * as React from "react";
import { Send, ArrowLeft, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useInvitacionMasiva } from "../hooks/useInvitacionMasiva";
import { ETIQUETA_ACCION, ACCIONES_CON_ENVIO, MAX_LINEAS } from "../types";
import type { AccionLinea } from "../types";

export interface InvitarVariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  conjuntoId: string;
  conjuntoNombre?: string;
  /** Para recargar el listado cuando se envía. */
  onEnviado: () => void;
}

const VARIANTE: Record<AccionLinea, "success" | "info" | "warning" | "neutral"> = {
  invitar: "success",
  reenviar: "info",
  ya_tiene_cuenta: "warning",
  apartamento_no_encontrado: "warning",
  correo_invalido: "neutral",
  repetido: "neutral",
};

export function InvitarVariosModal({ isOpen, onClose, conjuntoId, conjuntoNombre, onEnviado }: InvitarVariosModalProps) {
  const m = useInvitacionMasiva(conjuntoId, onEnviado);

  const cerrar = () => {
    m.reiniciar();
    onClose();
  };

  const conEnvio = m.lineas.filter(l => ACCIONES_CON_ENVIO.includes(l.accion)).length;
  const omitidas = m.lineas.length - conEnvio;

  const pie =
    m.paso === "escribir" ? (
      <>
        <Button variant="outline" onClick={cerrar} disabled={m.cargando}>Cancelar</Button>
        <Button onClick={m.revisar} loading={m.cargando} disabled={!m.texto.trim()} icon={<ListChecks className="w-4 h-4" />}>
          Revisar lista
        </Button>
      </>
    ) : m.paso === "revisar" ? (
      <>
        <Button variant="outline" onClick={m.volver} disabled={m.cargando} icon={<ArrowLeft className="w-4 h-4" />}>
          Corregir
        </Button>
        <Button onClick={m.enviar} loading={m.cargando} disabled={conEnvio === 0} icon={<Send className="w-4 h-4" />}>
          Enviar {conEnvio} {conEnvio === 1 ? "invitación" : "invitaciones"}
        </Button>
      </>
    ) : (
      <Button onClick={cerrar}>Listo</Button>
    );

  return (
    <Modal
      isOpen={isOpen}
      title="Invitar varios residentes"
      description={`Cada uno recibe por correo su enlace para crear la cuenta en ${conjuntoNombre?.trim() || "el conjunto"} y los enlaces para descargar la app.`}
      onClose={cerrar}
      busy={m.cargando}
      size="lg"
      footer={pie}
    >
      {m.error && <Alert variant="danger">{m.error}</Alert>}

      {m.paso === "escribir" && (
        <div className="space-y-1">
          <label htmlFor="masivo-lista" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Lista de residentes
          </label>
          <textarea
            id="masivo-lista"
            rows={10}
            value={m.texto}
            onChange={(e) => m.setTexto(e.target.value)}
            disabled={m.cargando}
            placeholder={"ana@correo.com, 101\njuan@correo.com, 102\nmaria@correo.com"}
            className="w-full font-mono text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:opacity-50 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 resize-y"
          />
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Una línea por residente: el correo y, si quieres, el número de apartamento separado por
            coma. Puedes copiar dos columnas de Excel. Máximo {MAX_LINEAS} por envío.
          </p>
        </div>
      )}

      {m.paso === "listo" && m.resultado && (
        <Alert variant={m.resultado.fallidas.length ? "warning" : "success"}>
          Se enviaron {m.resultado.enviadas} {m.resultado.enviadas === 1 ? "invitación" : "invitaciones"}.
          {m.resultado.fallidas.length > 0 &&
            ` ${m.resultado.fallidas.length} no salieron: quedaron marcadas con error en el listado para reenviarlas.`}
        </Alert>
      )}

      {m.paso !== "escribir" && (
        <>
          {m.paso === "revisar" && (
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              <strong>{conEnvio}</strong> recibirán el correo
              {omitidas > 0 && <>; <strong>{omitidas}</strong> se omiten</>}. Revisa antes de enviar.
            </p>
          )}
          <div className="max-h-72 overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800">
            {m.lineas.map(l => (
              <div key={l.linea} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 px-3 py-2 text-xs">
                <div className="min-w-0">
                  <span className="text-zinc-400 mr-2">{l.linea}.</span>
                  <span className="font-semibold text-zinc-900 dark:text-white wrap-anywhere">{l.email || "(vacío)"}</span>
                  {l.apartamento && <span className="text-zinc-500 dark:text-zinc-400"> · apto {l.apartamento}</span>}
                </div>
                <Badge variant={VARIANTE[l.accion]}>{ETIQUETA_ACCION[l.accion]}</Badge>
              </div>
            ))}
          </div>
        </>
      )}
    </Modal>
  );
}
