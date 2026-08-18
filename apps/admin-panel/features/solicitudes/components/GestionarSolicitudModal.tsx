'use client';

import * as React from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import { formatoMoneda } from "@/lib/formato";
import { ESTADOS, ETIQUETA_ESTADO, PRIORIDADES, ETIQUETA_PRIORIDAD } from "@/lib/solicitudes";
import type { EstadoSolicitud, PrioridadSolicitud } from "@/lib/solicitudes";
import { useGestionSolicitud } from "../hooks/useGestionSolicitud";
import { DatosSolicitud } from "./DatosSolicitud";
import type { Solicitud, AdminAsignable, GestionSolicitud, ResultadoGestion } from "../types";

export interface GestionarSolicitudModalProps {
  solicitud: Solicitud | null;
  admins: AdminAsignable[];
  onClose: () => void;
  onGestionar: (payload: GestionSolicitud) => Promise<ResultadoGestion>;
}

export function GestionarSolicitudModal({
  solicitud, admins, onClose, onGestionar,
}: GestionarSolicitudModalProps) {
  const g = useGestionSolicitud(solicitud, onGestionar);

  if (!solicitud || !g.form) return null;

  const yaCobrada = Boolean(solicitud.costo);

  return (
    <Modal
      isOpen
      title="Gestionar solicitud"
      description="Los cambios de estado le llegan al residente como notificación."
      onClose={onClose}
      busy={g.loading}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={g.loading}>Cerrar</Button>
          <Button onClick={g.guardar} loading={g.loading} icon={<Save className="w-4 h-4" />}>
            Guardar
          </Button>
        </>
      }
    >
      {g.error && <Alert variant="danger">{g.error}</Alert>}
      {g.exito && <Alert variant="success">{g.exito}</Alert>}

      <DatosSolicitud solicitud={solicitud} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          id="gestion-estado"
          label="Estado"
          value={g.form.estado}
          onChange={(e) => g.cambiar("estado", e.target.value as EstadoSolicitud)}
          options={ESTADOS.map(e => ({ value: e, label: ETIQUETA_ESTADO[e] }))}
          disabled={g.loading}
        />

        <Select
          id="gestion-prioridad"
          label="Prioridad"
          value={g.form.prioridad}
          onChange={(e) => g.cambiar("prioridad", e.target.value as PrioridadSolicitud | "")}
          options={[
            { value: "", label: "Sin definir" },
            ...PRIORIDADES.map(p => ({ value: p, label: ETIQUETA_PRIORIDAD[p] })),
          ]}
          disabled={g.loading}
        />
      </div>

      <Select
        id="gestion-admin"
        label="Asignar a"
        value={g.form.adminId}
        onChange={(e) => g.cambiar("adminId", e.target.value)}
        options={[
          { value: "", label: "Sin asignar" },
          ...admins.map(a => ({
            value: a.id,
            label: a.rol && a.rol !== "Admin" ? `${a.nombre} (${a.rol})` : a.nombre,
          })),
        ]}
        disabled={g.loading}
      />

      <div className="w-full space-y-1 text-left">
        <label
          htmlFor="gestion-comentario"
          className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
        >
          Comentario del administrador
        </label>
        <textarea
          id="gestion-comentario"
          rows={3}
          value={g.form.comentario}
          onChange={(e) => g.cambiar("comentario", e.target.value)}
          disabled={g.loading}
          placeholder="Lo verá el residente junto al cambio de estado."
          className="w-full text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-2.5 transition-all outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:opacity-50 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 resize-y"
        />
      </div>

      <Select
        id="gestion-viable"
        label="¿La fecha que pidió el residente es viable?"
        value={g.form.viable}
        onChange={(e) => g.cambiar("viable", e.target.value as "" | "si" | "no")}
        options={[
          { value: "", label: "Sin responder" },
          { value: "si", label: "Sí, es viable" },
          { value: "no", label: "No, se reprograma" },
        ]}
        disabled={g.loading}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="gestion-dia"
          type="date"
          label="Día de atención"
          value={g.form.dia}
          onChange={(e) => g.cambiar("dia", e.target.value)}
          disabled={g.loading}
        />
        <Input
          id="gestion-hora"
          type="time"
          label="Hora de atención"
          value={g.form.hora}
          onChange={(e) => g.cambiar("hora", e.target.value)}
          disabled={g.loading}
        />
      </div>

      <Input
        id="gestion-costo"
        type="number"
        min={0}
        label="Costo"
        value={g.form.costo}
        onChange={(e) => g.cambiar("costo", e.target.value)}
        disabled={g.loading || yaCobrada}
        helperText={
          yaCobrada
            ? `Ya se generó un cargo de ${formatoMoneda(solicitud.costo)} para esta solicitud.`
            : "Al guardar con un costo mayor que cero se genera un cargo real al residente."
        }
      />
    </Modal>
  );
}
