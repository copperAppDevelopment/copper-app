'use client';

import * as React from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { OPCIONES_PRONTO_PAGO } from "@/lib/conceptos";
import type { TipoProntoPago } from "@/lib/conceptos";
import type { DatosConfiguracion } from "../adminTypes";

export interface ConfiguracionPagoFormProps {
  form: DatosConfiguracion;
  guardando: boolean;
  onCambiar: <K extends keyof DatosConfiguracion>(campo: K, valor: DatosConfiguracion[K]) => void;
  onGuardar: () => void;
}

export function ConfiguracionPagoForm({
  form, guardando, onCambiar, onGuardar,
}: ConfiguracionPagoFormProps) {
  const porValor = form.pronto_pago_tipo === "valor";

  return (
    <Card
      title="Cobro y pronto pago"
      subtitle="Se aplica a los cargos que genera la facturación mensual."
      className="shadow-sm"
    >
      <div className="space-y-5">
        <Input
          id="config-link"
          label="Enlace de pago"
          placeholder="https://…"
          value={form.link_pago}
          onChange={(e) => onCambiar("link_pago", e.target.value)}
          disabled={guardando}
          helperText="La administración no se cobra por pasarela: este enlace se copia en cada cargo que se genera."
        />

        {/* Datos del emisor. Se guardan en `conjuntos`, no en la configuración, pero se editan
            aquí porque solo se usan para imprimir la cuenta de cobro. */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
          <div>
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
              Datos para la cuenta de cobro
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Salen impresos en el PDF que descargan los residentes. Los que dejes vacíos
              sencillamente no aparecen.
            </p>
          </div>

          <Input
            id="config-nit"
            label="NIT"
            placeholder="900.123.456-7"
            value={form.nit}
            onChange={(e) => onCambiar("nit", e.target.value)}
            disabled={guardando}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="config-telefono"
              label="Teléfono de contacto"
              placeholder="300 000 0000"
              value={form.telefono}
              onChange={(e) => onCambiar("telefono", e.target.value)}
              disabled={guardando}
            />
            <Input
              id="config-email"
              label="Correo de contacto"
              type="email"
              placeholder="administracion@conjunto.co"
              value={form.email}
              onChange={(e) => onCambiar("email", e.target.value)}
              disabled={guardando}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
          <label htmlFor="config-pronto" className="flex items-center gap-2.5 cursor-pointer">
            <input
              id="config-pronto"
              type="checkbox"
              checked={form.pronto_pago_habilitado}
              onChange={(e) => onCambiar("pronto_pago_habilitado", e.target.checked)}
              disabled={guardando}
              className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-brand focus:ring-brand/30 cursor-pointer"
            />
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
              Ofrecer descuento por pronto pago
            </span>
          </label>

          {form.pronto_pago_habilitado && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  id="config-tipo"
                  label="Tipo de descuento"
                  value={form.pronto_pago_tipo}
                  onChange={(e) => onCambiar("pronto_pago_tipo", e.target.value as TipoProntoPago)}
                  options={OPCIONES_PRONTO_PAGO}
                  disabled={guardando}
                />

                {porValor ? (
                  <Input
                    id="config-valor"
                    type="number"
                    min={0}
                    label="Valor del descuento"
                    value={form.pronto_pago_valor}
                    onChange={(e) => onCambiar("pronto_pago_valor", e.target.value)}
                    disabled={guardando}
                  />
                ) : (
                  <Input
                    id="config-porcentaje"
                    type="number"
                    min={1}
                    max={100}
                    label="Porcentaje de descuento"
                    value={form.pronto_pago_porcentaje}
                    onChange={(e) => onCambiar("pronto_pago_porcentaje", e.target.value)}
                    disabled={guardando}
                    helperText="Escribe 10 para un 10 %."
                  />
                )}
              </div>

              <Input
                id="config-dias"
                type="number"
                min={1}
                max={28}
                label="Días para el pronto pago"
                value={form.pronto_pago_dias}
                onChange={(e) => onCambiar("pronto_pago_dias", e.target.value)}
                disabled={guardando}
                helperText="Día del mes hasta el cual se mantiene el descuento."
              />

              <Alert variant="info">
                El descuento solo se aplica a los conceptos marcados como «admite el descuento por
                pronto pago».
              </Alert>
            </>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={onGuardar} loading={guardando} icon={<Save className="w-4 h-4" />}>
            Guardar configuración
          </Button>
        </div>
      </div>
    </Card>
  );
}
