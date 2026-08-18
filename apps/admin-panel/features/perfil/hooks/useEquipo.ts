'use client';

import { useState, useEffect, useCallback } from "react";
import * as api from "../conjuntosApi";
import type { MiembroEquipo, NuevoMiembro, UsuarioExistenteEquipo } from "../conjuntosTypes";
import type { RolEquipo } from "@/lib/equipo";

export function useEquipo(conjuntoId: string) {
  const [miembros, setMiembros] = useState<MiembroEquipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const recargar = useCallback(async (id: string) => {
    try {
      setMiembros(await api.listarEquipo(id));
      setError("");
    } catch (e) {
      console.error("Error al cargar el equipo:", e);
      setError("No se pudo cargar el equipo.");
    }
  }, []);

  useEffect(() => {
    if (!conjuntoId) return;
    (async () => {
      await recargar(conjuntoId);
      setLoading(false);
    })();
  }, [conjuntoId, recargar]);

  /** Devuelve el usuario si el correo ya tenía cuenta; `null` si se envió la invitación. */
  const invitar = async (payload: NuevoMiembro):
    Promise<{ usuarioExistente: UsuarioExistenteEquipo | null; mensaje: string | null }> => {
    const json = await api.invitarMiembro(conjuntoId, payload);

    if (json.data?.yaRegistrado) {
      return { usuarioExistente: json.data.usuario, mensaje: null };
    }

    return {
      usuarioExistente: null,
      mensaje: json.message || "Invitación enviada correctamente.",
    };
  };

  const vincular = async (userId: string, rol: RolEquipo) => {
    await api.vincularMiembro(conjuntoId, userId, rol);
    await recargar(conjuntoId);
  };

  const remover = async (miembroId: string) => {
    await api.removerMiembro(conjuntoId, miembroId);
    await recargar(conjuntoId);
  };

  return { miembros, loading, error, setError, invitar, vincular, remover };
}
