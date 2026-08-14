import * as React from "react";
import { Car, Users, PawPrint, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatoFecha, nombreCompleto } from "@/lib/formato";
import type { ResidenteCompleto } from "../types";

/** Tarjeta con estado vacío propio, común a las cuatro sub-colecciones. */
function Coleccion({
  titulo, icono, items, children,
}: {
  titulo: string;
  icono: React.ReactNode;
  items: unknown[] | null | undefined;
  children: React.ReactNode;
}) {
  return (
    <Card
      title={<div className="flex items-center gap-2">{icono}<span>{titulo}</span></div>}
      headerActions={
        <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs px-2.5 py-1 rounded-full font-semibold">
          {items?.length ?? 0}
        </span>
      }
      className="shadow-sm"
    >
      {!items || items.length === 0 ? (
        <p className="py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">Sin registros</p>
      ) : (
        <div className="space-y-2">{children}</div>
      )}
    </Card>
  );
}

function Item({ titulo, detalle }: { titulo: string; detalle: string }) {
  return (
    <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
      <p className="text-sm font-semibold text-zinc-900 dark:text-white">{titulo}</p>
      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{detalle}</p>
    </div>
  );
}

const unir = (partes: (string | null | undefined)[]) =>
  partes.filter(Boolean).join(" · ") || "—";

export function SubColecciones({ residente }: { residente: ResidenteCompleto | null }) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Coleccion titulo="Vehículos" icono={<Car className="w-5 h-5 text-brand" />} items={residente?.vehiculos}>
        {residente?.vehiculos?.map(v => (
          <Item
            key={v.id}
            titulo={[v.marca, v.modelo].filter(Boolean).join(" ") || "Sin marca"}
            detalle={unir([v.placa, v.color, v.tipo_vehiculo])}
          />
        ))}
      </Coleccion>

      <Coleccion titulo="Convivientes" icono={<Users className="w-5 h-5 text-brand" />} items={residente?.convivientes}>
        {residente?.convivientes?.map(c => (
          <Item
            key={c.id}
            titulo={nombreCompleto(c)}
            detalle={unir([c.parentesco, c.fecha_nacimiento ? formatoFecha(c.fecha_nacimiento) : null])}
          />
        ))}
      </Coleccion>

      <Coleccion titulo="Mascotas" icono={<PawPrint className="w-5 h-5 text-brand" />} items={residente?.mascotas}>
        {residente?.mascotas?.map(m => (
          <Item
            key={m.id}
            titulo={m.nombre || "Sin nombre"}
            detalle={unir([m.especie, m.raza, m.tamano])}
          />
        ))}
      </Coleccion>

      <Coleccion
        titulo="Empleados de servicio"
        icono={<Briefcase className="w-5 h-5 text-brand" />}
        items={residente?.empleados_servicio}
      >
        {residente?.empleados_servicio?.map(e => (
          <Item
            key={e.id}
            titulo={nombreCompleto(e)}
            detalle={unir([e.cargo, `${e.tipo_documento ?? ""} ${e.documento_ident ?? ""}`.trim()])}
          />
        ))}
      </Coleccion>
    </section>
  );
}
