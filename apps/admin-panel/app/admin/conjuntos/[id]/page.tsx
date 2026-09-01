'use client';

import * as React from "react";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Pencil, QrCode, CreditCard } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";
import { AdminPageShell } from "@/components/layout/admin-page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { formatoMoneda, formatoFecha } from "@/lib/formato";
import { etiquetaSuscripcion, varianteSuscripcion, textoVigencia } from "@/lib/suscripciones";
import { ETIQUETA_PERIODO } from "@/lib/conjuntos";
import type { TipoPeriodo } from "@/lib/conjuntos";
import { useConjuntoDetalle } from "@/features/conjuntos/hooks/useConjuntoDetalle";
import { ConjuntoFormModal } from "@/features/conjuntos/components/ConjuntoFormModal";
import { QrModal } from "@/features/conjuntos/components/QrModal";
import { PlanModal } from "@/features/conjuntos/components/PlanModal";

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

export default function DetalleConjuntoPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const sesion = useAdminSession();
  const conjuntoId = params?.id ?? "";
  const d = useConjuntoDetalle(conjuntoId, sesion.userId);

  const [editando, setEditando] = useState(false);
  const [qrAbierto, setQrAbierto] = useState(false);
  const [planAbierto, setPlanAbierto] = useState(false);

  const detalle = d.detalle;
  const estadoSuscripcion = detalle?.estado_suscripcion ?? null;

  return (
    <AdminPageShell
      sesion={sesion}
      active="conjuntos"
      loading={d.loading}
      titulo={detalle?.nombre ?? "Conjunto"}
      subtitulo={[detalle?.direccion, detalle?.ciudad].filter(Boolean).join(" · ")}
      tituloAdorno={
        detalle && (
          <Badge variant={varianteSuscripcion(estadoSuscripcion)}>
            {etiquetaSuscripcion(estadoSuscripcion)}
          </Badge>
        )
      }
      encabezado={
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.push("/admin/conjuntos")}
          className="-ml-3"
        >
          Volver a mis conjuntos
        </Button>
      }
      acciones={
        detalle && (
          <>
            <Button
              variant="outline"
              onClick={() => setEditando(true)}
              icon={<Pencil className="w-4 h-4" />}
            >
              Editar
            </Button>
            <Button
              variant="outline"
              onClick={() => setQrAbierto(true)}
              icon={<QrCode className="w-4 h-4" />}
            >
              Código QR
            </Button>
            <Button
              onClick={() => setPlanAbierto(true)}
              icon={<CreditCard className="w-4 h-4" />}
            >
              {d.suscripcion ? "Cambiar plan" : "Activar suscripción"}
            </Button>
          </>
        )
      }
    >
      {d.sinAcceso ? (
        <Alert variant="danger" title="No se pudo abrir el conjunto">
          Este conjunto no existe o no lo administras.
        </Alert>
      ) : (
        <>
          {d.error && <Alert variant="danger">{d.error}</Alert>}

          {detalle && (
            <>
              <Card title="Suscripción" className="shadow-sm">
                {estadoSuscripcion ? (
                  <div className="space-y-4">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {textoVigencia(estadoSuscripcion, detalle.fecha_fin)}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Dato etiqueta="Plan" valor={detalle.nombre_plan} />
                      <Dato
                        etiqueta="Periodo"
                        valor={
                          detalle.tipo_periodo
                            ? ETIQUETA_PERIODO[detalle.tipo_periodo as TipoPeriodo] ?? detalle.tipo_periodo
                            : null
                        }
                      />
                      <Dato etiqueta="Inicio" valor={formatoFecha(detalle.fecha_inicio)} />
                      <Dato etiqueta="Vencimiento" valor={formatoFecha(detalle.fecha_fin)} />
                      <Dato
                        etiqueta="Precio pagado"
                        valor={detalle.precio_pagado ? formatoMoneda(detalle.precio_pagado) : null}
                      />
                      <Dato etiqueta="Método de pago" valor={detalle.metodo_pago} />
                      <Dato
                        etiqueta="Referencia"
                        valor={
                          detalle.referencia_pago && (
                            <span className="font-mono text-xs">{detalle.referencia_pago}</span>
                          )
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Este conjunto no tiene ninguna suscripción. Actívala para que sus
                    residentes puedan usar la app.
                  </p>
                )}
              </Card>

              <Card title="Datos del conjunto" className="shadow-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Dato etiqueta="Dirección" valor={detalle.direccion} />
                  <Dato etiqueta="Ciudad" valor={detalle.ciudad} />
                  <Dato etiqueta="Tipo de vivienda" valor={detalle.tipo_vivienda} />
                  <Dato etiqueta="Estrato" valor={detalle.estrato} />
                  <Dato
                    etiqueta={detalle.tipo_vivienda === "Casas" ? "Casas" : "Apartamentos"}
                    valor={detalle.num_viviendas}
                  />
                  <Dato etiqueta="Año Construcción" valor={detalle.anio_construccion} />
                  <Dato
                    etiqueta="Valor de administración"
                    valor={
                      detalle.valor_administracion
                        ? formatoMoneda(detalle.valor_administracion)
                        : null
                    }
                  />
                  <Dato etiqueta="Creado" valor={formatoFecha(detalle.fecha_creacion)} />
                </div>
              </Card>
            </>
          )}
        </>
      )}

      <ConjuntoFormModal
        isOpen={editando}
        conjuntoId={conjuntoId}
        inicial={d.editables}
        onClose={() => setEditando(false)}
        onGuardado={() => d.recargar()}
      />

      <QrModal
        isOpen={qrAbierto}
        conjuntoId={conjuntoId}
        nombre={detalle?.nombre ?? "conjunto"}
        onClose={() => setQrAbierto(false)}
      />

      <PlanModal
        isOpen={planAbierto}
        conjuntoId={conjuntoId}
        suscripcion={d.suscripcion}
        onClose={() => setPlanAbierto(false)}
      />
    </AdminPageShell>
  );
}
