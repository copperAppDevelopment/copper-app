'use client';

import * as React from "react";
import { Bell, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

export interface AvisosCobroCardProps {
  /** Cambia el calendario: sin pronto pago, el aviso del descuento no existe. */
  prontoPagoHabilitado: boolean;
  /** Día del mes hasta el que vale el descuento, para decir cuándo sale su aviso. */
  prontoPagoDias: string;
}

interface Aviso {
  cuando: string;
  titulo: string;
  detalle: string;
}

/**
 * Qué avisos recibe el residente por su cuota, y cuándo.
 *
 * Es informativa a propósito: no hay interruptor por conjunto todavía. Existe porque hoy el
 * administrador no tiene forma de saber qué le está llegando a su gente al teléfono.
 */
export function AvisosCobroCard({ prontoPagoHabilitado, prontoPagoDias }: AvisosCobroCardProps) {
  const dias = Number(prontoPagoDias);

  const avisos: Aviso[] = [
    {
      cuando: "El día 1",
      titulo: "Se generó tu cuota",
      detalle: "Con el valor del mes y la fecha de vencimiento. Le llega a todo el que tenga cargo nuevo.",
    },
    ...(prontoPagoHabilitado && dias >= 1
      ? [{
          cuando: `El día ${Math.max(dias - 2, 1)}`,
          titulo: "Te quedan 2 días para el descuento",
          detalle: `Con lo que se ahorra si paga antes del día ${dias}. Solo a quien aún no ha pagado.`,
        }]
      : []),
    {
      cuando: "5 días antes de vencer",
      titulo: "Tu cuota vence en 5 días",
      detalle: "Con el saldo pendiente. Solo a quien debe algo.",
    },
    {
      cuando: "1 día antes",
      titulo: "Tu cuota vence en 1 día",
      detalle: "El último recordatorio con margen para pagar.",
    },
    {
      cuando: "El día del vencimiento",
      titulo: "Tu cuota vence hoy",
      detalle: "Último aviso antes de que el saldo empiece a generar mora.",
    },
  ];

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-brand" />
          <span>Avisos al residente</span>
        </div>
      }
      subtitle="Notificaciones que salen solas cada mes, a las 8 de la mañana."
      className="shadow-sm"
    >
      <div className="space-y-3">
        {avisos.map(aviso => (
          <div key={aviso.titulo} className="flex gap-3">
            <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                {aviso.titulo}
                <span className="ml-2 text-[11px] font-normal text-zinc-500 dark:text-zinc-400">
                  {aviso.cuando}
                </span>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{aviso.detalle}</p>
            </div>
          </div>
        ))}

        {!prontoPagoHabilitado && (
          <Alert variant="info">
            Con el pronto pago activo se añade un aviso más, dos días antes de que venza el
            descuento. Es el que más empuja a pagar temprano.
          </Alert>
        )}
      </div>
    </Card>
  );
}
