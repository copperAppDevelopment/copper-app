'use client';

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Power } from "lucide-react";
import { useSuperAdminSession } from "@/hooks/useSuperAdminSession";
import { SuperAdminPageShell } from "@/components/layout/superadmin-page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatoMoneda, formatoFecha } from "@/lib/formato";
import { etiquetaSuscripcion, varianteSuscripcion, textoVigencia } from "@/lib/suscripciones";
import { ETIQUETA_PERIODO } from "@/lib/conjuntos";
import type { TipoPeriodo } from "@/lib/conjuntos";
import * as api from "@/features/superadmin/api";
import type { ConjuntoSuper } from "@/features/superadmin/types";

function Dato({ etiqueta, valor }: { etiqueta: string; valor: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        {etiqueta}
      </p>
      <p className="text-sm text-zinc-800 dark:text-zinc-100 break-words">{valor || "—"}</p>
    </div>
  );
}

/** La ficha del conjunto para el SuperAdmin: de solo lectura salvo el interruptor de acceso. */
export default function DetalleConjuntoSuperPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const sesion = useSuperAdminSession();
  const conjuntoId = params?.id ?? "";

  const [conjunto, setConjunto] = useState<ConjuntoSuper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [confirmando, setConfirmando] = useState(false);
  const [ocupado, setOcupado] = useState(false);

  const recargar = useCallback(async () => {
    if (!conjuntoId) return;
    try {
      setConjunto(await api.obtenerConjuntoSuper(conjuntoId));
      setError("");
    } catch (e: any) {
      console.error("Error al cargar el conjunto:", e);
      setError("No se pudo cargar el conjunto.");
    } finally {
      setLoading(false);
    }
  }, [conjuntoId]);

  useEffect(() => {
    if (sesion.loading) return;
    recargar();
  }, [sesion.loading, recargar]);

  const cambiar = async () => {
    if (!conjunto) return;
    setOcupado(true);
    try {
      const r = await api.cambiarActivoConjunto(conjunto.conjunto_id, !conjunto.activo);
      await recargar();
      setAviso(
        r.activo
          ? `${r.conjunto} vuelve a estar activo.`
          : `${r.conjunto} quedó desactivado: ${r.residentes_afectados} residentes pierden el acceso a la app.`
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setOcupado(false);
      setConfirmando(false);
    }
  };

  const activo = Boolean(conjunto?.activo);

  return (
    <SuperAdminPageShell
      sesion={sesion}
      active="conjuntos"
      loading={loading}
      titulo={conjunto?.nombre_conjunto ?? "Conjunto"}
      subtitulo={[conjunto?.direccion, conjunto?.ciudad].filter(Boolean).join(" · ")}
      acciones={
        conjunto && (
          <Button
            variant={activo ? "danger" : "primary"}
            onClick={() => setConfirmando(true)}
            icon={<Power className="w-4 h-4" />}
          >
            {activo ? "Desactivar" : "Activar"}
          </Button>
        )
      }
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/superadmin/conjuntos")}
        icon={<ArrowLeft className="w-4 h-4" />}
        className="-ml-3"
      >
        Volver a conjuntos
      </Button>

      {error && <Alert variant="danger" onClose={() => setError("")}>{error}</Alert>}
      {aviso && <Alert variant="success" onClose={() => setAviso("")}>{aviso}</Alert>}

      {!conjunto ? (
        <Alert variant="warning">Este conjunto no existe.</Alert>
      ) : (
        <>
          {!activo && (
            <Alert variant="warning">
              Está desactivado: sus {conjunto.num_residentes} residentes activos no pueden usar la
              app. {conjunto.vetado
                ? "Se desactivó desde aquí, así que un pago de suscripción no lo reactivará."
                : "Nunca se activó; el primer pago de suscripción lo activará."}
            </Alert>
          )}

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card
              title="Suscripción"
              headerActions={
                conjunto.suscripcion_id && (
                  <Badge variant={varianteSuscripcion(conjunto.estado_suscripcion)}>
                    {etiquetaSuscripcion(conjunto.estado_suscripcion)}
                  </Badge>
                )
              }
              className="shadow-sm"
            >
              {conjunto.suscripcion_id ? (
                <div className="space-y-4">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {textoVigencia(conjunto.estado_suscripcion, conjunto.fecha_fin)}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <Dato etiqueta="Plan" valor={conjunto.nombre_plan} />
                    <Dato
                      etiqueta="Periodo"
                      valor={ETIQUETA_PERIODO[conjunto.tipo_periodo as TipoPeriodo] ?? conjunto.tipo_periodo}
                    />
                    <Dato etiqueta="Inicio" valor={formatoFecha(conjunto.fecha_inicio)} />
                    <Dato etiqueta="Vencimiento" valor={formatoFecha(conjunto.fecha_fin)} />
                    <Dato etiqueta="Precio" valor={formatoMoneda(conjunto.precio_pagado)} />
                    <Dato
                      etiqueta="Método"
                      valor={conjunto.metodo_pago === "manual" ? "Asignado a mano" : conjunto.metodo_pago}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Este conjunto no tiene ninguna suscripción registrada.
                </p>
              )}
            </Card>

            <Card title="Datos del conjunto" className="shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <Dato etiqueta="Administrador" valor={conjunto.propietario_nombre} />
                <Dato etiqueta="Correo" valor={conjunto.propietario_email} />
                <Dato etiqueta="Apartamentos" valor={conjunto.num_apartamentos} />
                <Dato etiqueta="Residentes activos" valor={conjunto.num_residentes} />
                <Dato etiqueta="Miembros del equipo" valor={conjunto.num_admins} />
                <Dato etiqueta="Tipo de vivienda" valor={conjunto.tipo_vivienda} />
                <Dato etiqueta="Estrato" valor={conjunto.estrato} />
                <Dato etiqueta="Por torres" valor={conjunto.tiene_torres ? "Sí" : "No"} />
                <Dato etiqueta="Registrado" valor={formatoFecha(conjunto.created_at)} />
              </div>
            </Card>
          </section>
        </>
      )}

      <ConfirmDialog
        isOpen={confirmando}
        title={activo ? "¿Desactivar el conjunto?" : "¿Activar el conjunto?"}
        description={
          activo
            ? `Los ${conjunto?.num_residentes ?? 0} residentes activos de ${conjunto?.nombre_conjunto ?? ""} dejarán de poder usar la app de inmediato, también quienes la tengan abierta. Sus administradores conservan el acceso al panel.`
            : `${conjunto?.nombre_conjunto ?? ""} vuelve a estar disponible y sus residentes recuperan el acceso.`
        }
        confirmText={activo ? "Desactivar" : "Activar"}
        cancelText="Cancelar"
        onConfirm={cambiar}
        onCancel={() => setConfirmando(false)}
        variant={activo ? "danger" : "primary"}
        loading={ocupado}
      />
    </SuperAdminPageShell>
  );
}
