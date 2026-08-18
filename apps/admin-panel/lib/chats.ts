import type { BadgeProps } from "@/components/ui/badge";

/**
 * Vocabulario de `chats`. Los valores son los de `chat_estado_enum`, capitalizados porque
 * son los que ya usa la app publicada: `useChats` inserta 'Activo' y `useChatRoom` compara
 * contra 'Finalizado' para bloquear el envío.
 *
 * ⚠️ Agregar un estado aquí exige agregarlo antes al enum de la base y desplegarlo.
 */
export type EstadoChat = "Activo" | "Finalizado";

export const ESTADOS_CHAT: EstadoChat[] = ["Activo", "Finalizado"];

export const VARIANTE_ESTADO_CHAT: Record<EstadoChat, NonNullable<BadgeProps["variant"]>> = {
  Activo: "success",
  Finalizado: "neutral",
};

export const esEstadoChat = (valor: string): valor is EstadoChat =>
  (ESTADOS_CHAT as string[]).includes(valor);

/** Tipos de mensaje que admite `chat_messages.message_type`. */
export const MIMES_CHAT = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
export const ACCEPT_CHAT = ".jpg,.jpeg,.png,.webp,.pdf";
export const MAX_BYTES_CHAT = 10 * 1024 * 1024;

/** Resumen del último mensaje para la lista, sin abrir el chat. */
export function resumenMensaje(tipo: string | null, contenido: string | null): string {
  if (tipo === "image") return "📷 Imagen";
  if (tipo === "file") return "📎 Archivo";
  return contenido?.trim() || "Sin mensajes";
}
