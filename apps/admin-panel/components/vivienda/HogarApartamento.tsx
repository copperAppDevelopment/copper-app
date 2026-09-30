'use client';

import * as React from "react";
import { useState } from "react";
import { Car, Users, PawPrint, Briefcase, Archive } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatoFecha, nombreCompleto } from "@/lib/formato";
import type { Hogar } from "./types";

/** Tarjeta con estado vacío propio, común a las cuatro colecciones. */
function Coleccion({
  titulo, icono, total, children,
}: {
  titulo: string;
  icono: React.ReactNode;
  total: number;
  children: React.ReactNode;
}) {
  return (
    <Card
      title={<div className="flex items-center gap-2">{icono}<span>{titulo}</span></div>}
      headerActions={
        <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs px-2.5 py-1 rounded-full font-semibold">
          {total}
        </span>
      }
      className="shadow-sm"
    >
      {total === 0 ? (
        <p className="py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">Sin registros</p>
      ) : (
        <div className="space-y-2">{children}</div>
      )}
    </Card>
  );
}

function Item({
  titulo, detalle, autor, archivadoEn,
}: {
  titulo: string;
  detalle: string;
  autor?: string | null;
  archivadoEn?: string | null;
}) {
  const pie = [
    autor ? `Registrado por ${autor}` : null,
    archivadoEn ? `Archivado el ${formatoFecha(archivadoEn)}` : null,
  ].filter(Boolean).join(" · ");

  return (
    <div
      className={`p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 ${archivadoEn ? "opacity-60" : ""}`}
    >
      <p className="text-sm font-semibold text-zinc-900 dark:text-white">{titulo}</p>
      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{detalle}</p>
      {pie && <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">{pie}</p>}
    </div>
  );
}

const unir = (partes: (string | null | undefined)[]) =>
  partes.filter(Boolean).join(" · ") || "—";

/**
 * Vehículos, convivientes, mascotas y empleados del apartamento. Son del hogar, no de un
 * residente: los comparten todos los que viven ahí.
 *
 * Si llegan registros archivados —de cuando el apartamento se desocupó— quedan ocultos tras
 * «Ver archivados».
 */
export function HogarApartamento({ hogar }: { hogar: Hogar | null }) {
  const [verArchivados, setVerArchivados] = useState(false);

  const visibles = <T extends { archivado_en?: string | null }>(lista: T[] | null | undefined) =>
    (lista ?? []).filter(x => verArchivados || !x.archivado_en);

  const archivados = [
    hogar?.vehiculos, hogar?.convivientes, hogar?.mascotas, hogar?.empleados_servicio,
  ].reduce((total, lista) => total + (lista ?? []).filter(x => x.archivado_en).length, 0);

  const vehiculos = visibles(hogar?.vehiculos);
  const convivientes = visibles(hogar?.convivientes);
  const mascotas = visibles(hogar?.mascotas);
  const empleados = visibles(hogar?.empleados_servicio);

  return (
    <section className="space-y-3">
      {archivados > 0 && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            icon={<Archive className="w-4 h-4" />}
            onClick={() => setVerArchivados(v => !v)}
          >
            {verArchivados ? "Ocultar archivados" : `Ver archivados (${archivados})`}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Coleccion titulo="Vehículos" icono={<Car className="w-5 h-5 text-brand" />} total={vehiculos.length}>
          {vehiculos.map(v => (
            <Item
              key={v.id}
              titulo={[v.marca, v.modelo].filter(Boolean).join(" ") || "Sin marca"}
              detalle={unir([v.placa, v.color, v.tipo_vehiculo])}
              autor={v.registrado_por_nombre}
              archivadoEn={v.archivado_en}
            />
          ))}
        </Coleccion>

        <Coleccion titulo="Convivientes" icono={<Users className="w-5 h-5 text-brand" />} total={convivientes.length}>
          {convivientes.map(c => (
            <Item
              key={c.id}
              titulo={nombreCompleto(c)}
              detalle={unir([c.parentesco, c.fecha_nacimiento ? formatoFecha(c.fecha_nacimiento) : null])}
              autor={c.registrado_por_nombre}
              archivadoEn={c.archivado_en}
            />
          ))}
        </Coleccion>

        <Coleccion titulo="Mascotas" icono={<PawPrint className="w-5 h-5 text-brand" />} total={mascotas.length}>
          {mascotas.map(m => (
            <Item
              key={m.id}
              titulo={m.nombre || "Sin nombre"}
              detalle={unir([m.especie, m.raza, m.tamano])}
              autor={m.registrado_por_nombre}
              archivadoEn={m.archivado_en}
            />
          ))}
        </Coleccion>

        <Coleccion
          titulo="Empleados de servicio"
          icono={<Briefcase className="w-5 h-5 text-brand" />}
          total={empleados.length}
        >
          {empleados.map(e => (
            <Item
              key={e.id}
              titulo={nombreCompleto(e)}
              detalle={unir([e.cargo, `${e.tipo_documento ?? ""} ${e.documento_ident ?? ""}`.trim()])}
              autor={e.registrado_por_nombre}
              archivadoEn={e.archivado_en}
            />
          ))}
        </Coleccion>
      </div>
    </section>
  );
}
