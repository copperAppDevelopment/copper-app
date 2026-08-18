'use client';

import * as React from "react";
import { Building2, Users, Home, CreditCard, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ConjuntoListado } from "../types";

export interface ConjuntoCardProps {
  conjunto: ConjuntoListado;
  onAbrir: () => void;
  onPagar: () => void;
}

function Cifra({ icono, valor, etiqueta }: {
  icono: React.ReactNode;
  valor: React.ReactNode;
  etiqueta: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-zinc-400 dark:text-zinc-500">{icono}</span>
      <div>
        <p className="text-sm font-bold text-zinc-900 dark:text-white leading-none">{valor}</p>
        <p className="text-[10px] uppercase tracking-wider text-zinc-400">{etiqueta}</p>
      </div>
    </div>
  );
}

export function ConjuntoCard({ conjunto, onAbrir, onPagar }: ConjuntoCardProps) {
  // `estado` es el alias que la vista le pone a `conjuntos.activo`.
  const activo = conjunto.estado;

  return (
    <Card className="shadow-sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          {conjunto.foto_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={conjunto.foto_url}
              alt={conjunto.nombre}
              className="w-14 h-14 rounded-2xl object-cover border border-zinc-200 dark:border-zinc-800 shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-brand" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="font-bold text-zinc-900 dark:text-white truncate">
                {conjunto.nombre}
              </p>
              <Badge variant={activo ? "success" : "warning"}>
                {activo ? "Activo" : "Pendiente de pago"}
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {[conjunto.direccion, conjunto.ciudad].filter(Boolean).join(" · ") || "Sin dirección"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Cifra
            icono={<Home className="w-4 h-4" />}
            valor={conjunto.cantidad_apartamentos}
            etiqueta={conjunto.tipo_vivienda === "Casas" ? "Casas" : "Apartamentos"}
          />
          <Cifra
            icono={<Users className="w-4 h-4" />}
            valor={conjunto.cantidad_admins}
            etiqueta="Administradores"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onAbrir}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            iconPosition="right"
          >
            Ver detalle
          </Button>

          {!activo && (
            <Button size="sm" onClick={onPagar} icon={<CreditCard className="w-3.5 h-3.5" />}>
              Completar pago
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
