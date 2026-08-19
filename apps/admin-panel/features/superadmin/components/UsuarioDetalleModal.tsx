'use client';

import * as React from "react";
import { useState } from "react";
import { Ban, Check, Building2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatoFecha, formatoMoneda } from "@/lib/formato";
import { etiquetaSuscripcion, varianteSuscripcion } from "@/lib/suscripciones";
import { ETIQUETA_PERIODO } from "@/lib/conjuntos";
import type { TipoPeriodo } from "@/lib/conjuntos";
import type { UsuarioAdmin, ConjuntoDeAdmin } from "../types";

export interface UsuarioDetalleModalProps {
  isOpen: boolean;
  usuario: UsuarioAdmin | null;
  conjuntos: ConjuntoDeAdmin[];
  onClose: () => void;
  onVetar: (usuario: UsuarioAdmin, vetado: boolean) => Promise<boolean>;
}

export function UsuarioDetalleModal({
  isOpen, usuario, conjuntos, onClose, onVetar,
}: UsuarioDetalleModalProps) {
  const [ocupado, setOcupado] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  if (!usuario) return null;

  const vetado = usuario.cuenta_bloqueada;

  const ejecutar = async () => {
    setOcupado(true);
    const bien = await onVetar(usuario, !vetado);
    setOcupado(false);
    setConfirmando(false);
    if (bien) onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        title={usuario.nombre_completo || "Sin nombre"}
        description={usuario.email ?? undefined}
        onClose={onClose}
        size="lg"
        busy={ocupado}
        footer={
          <>
            <Button variant="secondary" onClick={onClose} disabled={ocupado}>Cerrar</Button>
            <Button
              variant={vetado ? "primary" : "danger"}
              onClick={() => setConfirmando(true)}
              disabled={ocupado}
              icon={vetado ? <Check className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
            >
              {vetado ? "Devolver el acceso" : "Vetar del sistema"}
            </Button>
          </>
        }
      >
        <div className="flex items-center gap-2">
          {vetado ? (
            <Badge variant="danger">Vetado</Badge>
          ) : usuario.estado ? (
            <Badge variant="success">Con acceso</Badge>
          ) : (
            <Badge variant="neutral">Inactivo</Badge>
          )}
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {usuario.ultimo_login
              ? `Último acceso: ${formatoFecha(usuario.ultimo_login)}`
              : "Nunca ha entrado"}
          </span>
        </div>

        {!usuario.estado && !vetado && (
          <Alert variant="info">
            Esta cuenta está inactiva pero no la vetó nadie: nace así hasta que se paga la primera
            suscripción, y un pago la reactiva.
          </Alert>
        )}

        <dl className="text-sm space-y-2">
          <Linea etiqueta="Teléfono" valor={usuario.telefono || "—"} />
          <Linea etiqueta="Documento" valor={usuario.documento || "—"} />
          <Linea etiqueta="Registrado" valor={formatoFecha(usuario.created_at)} />
        </dl>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Conjuntos que administra ({conjuntos.length})
          </p>

          {conjuntos.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No administra ningún conjunto.
            </p>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              {conjuntos.map(c => (
                <div key={c.conjunto_id} className="p-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      {c.nombre_conjunto}
                      {c.es_propietario && <Badge variant="info">Propietario</Badge>}
                      {c.conjunto_activo === false && <Badge variant="neutral">Desactivado</Badge>}
                    </p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {c.nombre_plan
                        ? `${c.nombre_plan} · ${ETIQUETA_PERIODO[c.tipo_periodo as TipoPeriodo] ?? c.tipo_periodo} · ${formatoMoneda(c.precio_pagado)}`
                        : "Sin plan contratado"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {c.suscripcion_id ? (
                      <>
                        <Badge variant={varianteSuscripcion(c.estado_suscripcion)}>
                          {etiquetaSuscripcion(c.estado_suscripcion)}
                        </Badge>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">
                          {formatoFecha(c.fecha_fin)}
                        </p>
                      </>
                    ) : (
                      <Badge variant="neutral">Sin suscripción</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={confirmando}
        title={vetado ? "¿Devolver el acceso?" : "¿Vetar a esta persona?"}
        description={
          vetado
            ? `${usuario.nombre_completo ?? usuario.email} volverá a poder entrar al panel.`
            : `${usuario.nombre_completo ?? usuario.email} dejará de poder entrar al panel de inmediato, y un pago de suscripción no lo deshará. Los conjuntos que administra siguen funcionando.`
        }
        confirmText={vetado ? "Devolver el acceso" : "Vetar"}
        cancelText="Cancelar"
        onConfirm={ejecutar}
        onCancel={() => setConfirmando(false)}
        variant={vetado ? "primary" : "danger"}
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
