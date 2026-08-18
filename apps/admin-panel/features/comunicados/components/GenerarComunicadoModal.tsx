'use client';

import * as React from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import { useCrearComunicado } from "../hooks/useCrearComunicado";
import { OPCIONES_TIPO, OPCIONES_NOVEDAD, ACCEPT_ADJUNTO } from "../types";
import type { TipoComunicado, TipoNovedad } from "../types";

export interface GenerarComunicadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  conjuntoId: string;
  conjuntoNombre?: string;
}

export function GenerarComunicadoModal({
  isOpen,
  onClose,
  conjuntoId,
  conjuntoNombre,
}: GenerarComunicadoModalProps) {
  const c = useCrearComunicado(conjuntoId, isOpen);

  const cerrar = () => {
    c.reiniciar();
    onClose();
  };

  const esReporte = c.form.tipo === "Reporte";

  return (
    <Modal
      isOpen={isOpen}
      title="Generación de comunicados"
      description={
        conjuntoNombre
          ? `Se publicará en ${conjuntoNombre} y notificará a los residentes.`
          : "Se publicará en el conjunto y notificará a los residentes."
      }
      onClose={cerrar}
      busy={c.loading}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={cerrar} disabled={c.loading}>
            Cerrar
          </Button>
          <Button
            onClick={c.enviar}
            loading={c.loading}
            disabled={!c.form.titulo.trim() || !c.form.descripcion.trim()}
            icon={<Send className="w-4 h-4" />}
          >
            Publicar
          </Button>
        </>
      }
    >
      {c.error && <Alert variant="danger">{c.error}</Alert>}
      {c.exito && <Alert variant="success">{c.exito}</Alert>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          id="comunicado-tipo"
          label="Tipo de comunicado"
          value={c.form.tipo}
          onChange={(e) => c.cambiarTipo(e.target.value as TipoComunicado)}
          options={OPCIONES_TIPO}
          disabled={c.loading}
        />

        <Select
          id="comunicado-novedad"
          label="Tipo de novedad"
          value={c.form.tipo_novedad}
          onChange={(e) => c.cambiar("tipo_novedad", e.target.value as TipoNovedad)}
          options={OPCIONES_NOVEDAD}
          disabled={c.loading}
        />
      </div>

      {esReporte && (
        <Select
          id="comunicado-apartamento"
          label="Dirigido a"
          value={c.form.apartamento_id}
          onChange={(e) => c.cambiar("apartamento_id", e.target.value)}
          options={c.opcionesApartamento}
          disabled={c.loading}
          helperText="Si eliges un apartamento, solo sus residentes reciben el reporte."
        />
      )}

      <Input
        id="comunicado-titulo"
        label="Título"
        placeholder="Corte de agua programado"
        value={c.form.titulo}
        onChange={(e) => c.cambiar("titulo", e.target.value)}
        disabled={c.loading}
        maxLength={120}
      />

      <div className="w-full space-y-1 text-left">
        <label
          htmlFor="comunicado-descripcion"
          className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
        >
          Descripción
        </label>
        <textarea
          id="comunicado-descripcion"
          rows={4}
          value={c.form.descripcion}
          onChange={(e) => c.cambiar("descripcion", e.target.value)}
          disabled={c.loading}
          placeholder="Detalle del comunicado que verán los residentes."
          className="w-full text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 transition-all outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:opacity-50 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 resize-y"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="comunicado-adjunto"
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
        >
          <Paperclip className="w-3.5 h-3.5" />
          Adjunto (opcional)
        </label>
        <input
          id="comunicado-adjunto"
          key={c.version}
          type="file"
          accept={ACCEPT_ADJUNTO}
          disabled={c.loading}
          onChange={(e) => c.elegirArchivo(e.target.files?.[0] ?? null)}
          className="w-full text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 text-zinc-800 dark:text-zinc-100 file:mr-3 file:rounded-lg file:border-0 file:bg-brand/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand cursor-pointer disabled:opacity-50"
        />
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
          Imágenes (JPG, PNG, WEBP) o PDF. Máximo 10 MB.
        </p>
      </div>
    </Modal>
  );
}
