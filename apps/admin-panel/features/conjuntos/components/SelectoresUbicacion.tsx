'use client';

import * as React from "react";
import { useState, useEffect } from "react";
import { Select } from "@/components/ui/select";
import {
  listarDepartamentos,
  listarMunicipios,
  obtenerUbicacion,
} from "@/lib/ubicaciones";
import type { Departamento, Municipio } from "@/lib/ubicaciones";

export interface SelectoresUbicacionProps {
  /** Código DANE del municipio ya guardado, si se está editando. */
  codigoMunicipio: string;
  onChange: (codigoMunicipio: string) => void;
  disabled?: boolean;
}

/**
 * Departamento → ciudad, encadenados sobre el catálogo `ubicaciones`.
 *
 * Sustituye a los dos campos de texto libre que había: `conjuntos.codigo_municipio` tiene
 * FK al catálogo, así que un código tecleado a mano reventaba la inserción.
 *
 * El nombre de la ciudad no se envía: lo deriva el servidor del código elegido. Hay 66
 * nombres de municipio repetidos entre departamentos, y el par código→nombre solo es
 * fiable en la base.
 */
export function SelectoresUbicacion({
  codigoMunicipio,
  onChange,
  disabled = false,
}: SelectoresUbicacionProps) {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [departamento, setDepartamento] = useState("");
  const [error, setError] = useState("");

  // Al abrir en modo edición solo se conoce el municipio: hay que resolver su
  // departamento para poder preseleccionarlo y cargar su lista.
  useEffect(() => {
    let cancelado = false;

    (async () => {
      try {
        const lista = await listarDepartamentos();
        if (cancelado) return;
        setDepartamentos(lista);

        if (!codigoMunicipio) return;

        const ubicacion = await obtenerUbicacion(codigoMunicipio);
        if (cancelado || !ubicacion) return;

        setDepartamento(ubicacion.codigo_departamento);
        setMunicipios(await listarMunicipios(ubicacion.codigo_departamento));
      } catch (e) {
        console.error("Error al cargar las ubicaciones:", e);
        if (!cancelado) setError("No se pudo cargar el listado de ciudades.");
      }
    })();

    return () => { cancelado = true; };
  }, [codigoMunicipio]);

  const cambiarDepartamento = async (codigo: string) => {
    setDepartamento(codigo);
    // La ciudad anterior es de otro departamento: se limpia para no guardar un par
    // incoherente si el usuario no vuelve a elegir.
    onChange("");
    setMunicipios(codigo ? await listarMunicipios(codigo) : []);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Select
        id="conjunto-departamento"
        label="Departamento"
        value={departamento}
        onChange={(e) => cambiarDepartamento(e.target.value)}
        disabled={disabled || departamentos.length === 0}
        error={error || undefined}
        options={[
          { value: "", label: "Selecciona un departamento" },
          ...departamentos.map(d => ({
            value: d.codigo_departamento,
            label: d.nombre_departamento,
          })),
        ]}
      />

      <Select
        id="conjunto-municipio"
        label="Ciudad"
        value={codigoMunicipio}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || !departamento}
        helperText={departamento ? undefined : "Elige primero el departamento."}
        options={[
          { value: "", label: "Selecciona una ciudad" },
          ...municipios.map(m => ({
            value: m.codigo_municipio,
            label: m.nombre_municipio,
          })),
        ]}
      />
    </div>
  );
}
