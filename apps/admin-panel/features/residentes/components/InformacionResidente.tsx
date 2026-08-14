import * as React from "react";
import { User, Home } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ResidenteCompleto } from "../types";

function Dato({ label, valor }: { label: string; valor: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
      <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="text-xs font-semibold text-zinc-900 dark:text-white text-right">
        {valor || "—"}
      </span>
    </div>
  );
}

export function InformacionResidente({ residente }: { residente: ResidenteCompleto | null }) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card
        title={
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-brand" />
            <span>Información personal</span>
          </div>
        }
        className="shadow-sm"
      >
        <Dato
          label="Documento"
          valor={`${residente?.tipo_documento ?? ""} ${residente?.cedula ?? ""}`.trim()}
        />
        <Dato label="Correo" valor={residente?.email} />
        <Dato label="Teléfono" valor={residente?.phone_number} />
        <Dato label="Dirección personal" valor={residente?.direccion_personal} />
        <Dato
          label="Cuenta"
          valor={
            <Badge variant={residente?.estado ? "success" : "neutral"}>
              {residente?.estado ? "Habilitada" : "Deshabilitada"}
            </Badge>
          }
        />
      </Card>

      <Card
        title={
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-brand" />
            <span>Vivienda</span>
          </div>
        }
        className="shadow-sm"
      >
        <Dato label="Conjunto" valor={residente?.nombre_conjunto?.trim()} />
        <Dato label="Apartamento" valor={residente?.numero_apartamento ?? "Sin asignar"} />
        <Dato label="Dirección de la unidad" valor={residente?.direccion_unidad} />
        <Dato label="Estrato" valor={residente?.estrato} />
        <Dato label="Año de ingreso" valor={residente?.ano_ingreso} />
      </Card>
    </section>
  );
}
