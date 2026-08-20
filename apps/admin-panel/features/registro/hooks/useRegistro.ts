'use client';

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { setConjuntoSeleccionado } from "@/lib/conjunto";
import * as api from "../api";
import { REGISTRO_VACIO, motivoInvalido } from "../types";
import type { DatosRegistro, PasoRegistro } from "../types";

/**
 * El asistente de registro.
 *
 * Los pasos 2 y 3 no tienen formulario propio: reutilizan `ConjuntoFormModal` y `PlanModal`,
 * que son exactamente lo que un administrador ya usa desde el panel. Aquí solo se orquesta.
 */
export function useRegistro() {
  const [paso, setPaso] = useState<PasoRegistro>("cuenta");
  const [form, setForm] = useState<DatosRegistro>(REGISTRO_VACIO);
  const [conjuntoId, setConjuntoId] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [comprobando, setComprobando] = useState(true);

  /**
   * Reanudar sin repetir.
   *
   * Quien abandonó a mitad y vuelve a `/registro` no debe crear una segunda cuenta ni un
   * segundo conjunto: si ya hay sesión se salta el paso 1, y si ya tiene un conjunto sin pagar
   * se salta al plan.
   */
  useEffect(() => {
    let cancelado = false;

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (!cancelado) setComprobando(false);
        return;
      }

      const { data: perfil } = await supabase
        .from("users")
        .select("rol")
        .eq("id", session.user.id)
        .maybeSingle();

      // Un residente con sesión abierta no puede seguir por aquí: el registro es de
      // administradores. Se le deja empezar de cero.
      if (perfil?.rol !== "Admin") {
        await supabase.auth.signOut();
        if (!cancelado) setComprobando(false);
        return;
      }

      const { data: suyos } = await supabase
        .from("vista_mis_conjuntos_administracion")
        .select("conjunto_id, nombre, estado")
        .eq("user_id", session.user.id);

      const sinPagar = (suyos ?? []).find(c => !c.estado);
      if (cancelado) return;

      if (sinPagar) {
        setConjuntoId(sinPagar.conjunto_id as string);
        setPaso("plan");
      } else if ((suyos ?? []).length > 0) {
        // Ya tiene todo: no hay nada que registrar.
        setPaso("listo");
      } else {
        setPaso("conjunto");
      }
      setComprobando(false);
    })();

    return () => { cancelado = true; };
  }, []);

  const cambiar = <K extends keyof DatosRegistro>(clave: K, valor: DatosRegistro[K]) => {
    setForm(previo => ({ ...previo, [clave]: valor }));
    setError("");
  };

  const crearCuenta = async () => {
    const motivo = motivoInvalido(form);
    if (motivo) {
      setError(motivo);
      return;
    }

    setEnviando(true);
    setError("");
    try {
      await api.registrarAdmin(form);

      // Los pasos siguientes llaman a rutas que exigen sesión, así que se entra en el acto.
      const { error: entrando } = await supabase.auth.signInWithPassword({
        email: form.email.trim().toLowerCase(),
        password: form.contrasena,
      });

      if (entrando) throw new Error(entrando.message);

      // No se conserva la contraseña en memoria más de lo necesario.
      setForm(previo => ({ ...previo, contrasena: "", confirmacion: "" }));
      setPaso("conjunto");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  /** Lo llama `ConjuntoFormModal` al crear: el conjunto nace inactivo y toca pagarlo. */
  const conjuntoCreado = async (id: string) => {
    setConjuntoId(id);

    // Se deja seleccionado para que, al volver del pago, el panel no mande a /select-conjunto.
    // El nombre se lee de la base en vez de inventarlo: es el título del dashboard.
    const { data } = await supabase
      .from("conjuntos")
      .select("nombre, foto_url")
      .eq("id", id)
      .maybeSingle();

    setConjuntoSeleccionado({
      conjunto_id: id,
      nombre: data?.nombre ?? "",
      foto_url: data?.foto_url ?? null,
    });
    setPaso("plan");
  };

  return {
    paso, setPaso, form, cambiar, conjuntoId, conjuntoCreado,
    enviando, error, setError, comprobando, crearCuenta,
    motivo: motivoInvalido(form),
  };
}

export type EstadoRegistro = ReturnType<typeof useRegistro>;
