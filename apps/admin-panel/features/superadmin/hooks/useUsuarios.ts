'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import { useTablaLocal } from "@/hooks/useTablaLocal";
import * as api from "../api";
import type { UsuarioAdmin, ConjuntoDeAdmin } from "../types";

const PAGE_SIZE = 10;

export type FiltroUsuario = "" | "activos" | "vetados" | "sin_conjunto";

/** Los administradores de la plataforma, con sus conjuntos y el veto. */
export function useUsuarios(sesionCargando: boolean) {
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [conjuntos, setConjuntos] = useState<ConjuntoDeAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<FiltroUsuario>("");

  const recargar = useCallback(async () => {
    try {
      const datos = await api.listarUsuarios();
      setUsuarios(datos.usuarios);
      setConjuntos(datos.conjuntos);
      setError("");
    } catch (e: any) {
      console.error("Error al cargar los usuarios:", e);
      setError(e.message || "No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sesionCargando) return;
    recargar();
  }, [sesionCargando, recargar]);

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return usuarios.filter(u => {
      if (filtro === "activos" && (!u.estado || u.cuenta_bloqueada)) return false;
      if (filtro === "vetados" && !u.cuenta_bloqueada) return false;
      if (filtro === "sin_conjunto" && u.total_conjuntos > 0) return false;
      if (!texto) return true;
      return [u.nombre_completo, u.email, u.documento]
        .some(v => (v ?? "").toLowerCase().includes(texto));
    });
  }, [usuarios, busqueda, filtro]);

  const tabla = useTablaLocal(filtrados, {
    pageSize: PAGE_SIZE,
    sortInicial: "total_conjuntos",
    ordenInicial: "desc",
  });

  const contadores = useMemo(() => ({
    total: usuarios.length,
    activos: usuarios.filter(u => u.estado && !u.cuenta_bloqueada).length,
    vetados: usuarios.filter(u => u.cuenta_bloqueada).length,
    sinConjunto: usuarios.filter(u => u.total_conjuntos === 0).length,
  }), [usuarios]);

  /** Los conjuntos de un administrador, con el plan de cada uno. */
  const conjuntosDe = useCallback(
    (userId: string) => conjuntos.filter(c => c.user_id === userId),
    [conjuntos]
  );

  const vetar = async (usuario: UsuarioAdmin, vetado: boolean) => {
    setError("");
    setAviso("");
    try {
      await api.vetarUsuario(usuario.user_id, vetado);
      await recargar();
      setAviso(
        vetado
          ? `${usuario.nombre_completo ?? usuario.email} ya no puede entrar al sistema.`
          : `${usuario.nombre_completo ?? usuario.email} vuelve a tener acceso.`
      );
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const opcionesFiltro = [
    { value: "", label: "Todos" },
    { value: "activos", label: "Con acceso" },
    { value: "vetados", label: "Vetados" },
    { value: "sin_conjunto", label: "Sin conjuntos" },
  ];

  return {
    usuarios: filtrados, loading, error, setError, aviso, setAviso,
    busqueda, setBusqueda, filtro, setFiltro, opcionesFiltro,
    tabla, contadores, conjuntosDe, recargar, vetar,
  };
}

export type EstadoUsuarios = ReturnType<typeof useUsuarios>;
