import type { EstadoChat } from "@/lib/chats";

/** Una fila de `vista_chats_usuario`. */
export interface Chat {
  chat_id: string;
  asunto: string;
  estado: EstadoChat;
  created_at: string | null;
  updated_at: string | null;
  conjunto_id: string;
  residente_id: string;
  residente_user_id: string;
  admin_user_id: string | null;
  residente_nombre: string | null;
  residente_apellido: string | null;
  residente_foto: string | null;
  admin_nombre: string | null;
  admin_apellido: string | null;
  ultimo_mensaje: string | null;
  ultimo_mensaje_tipo: string | null;
  ultimo_mensaje_fecha: string | null;
  no_leidos_admin: number;
  no_leidos_residente: number;
}

export interface Mensaje {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string | null;
  message_type: string;
  file_name: string | null;
  created_at: string | null;
}

export type FiltroEstadoChat = EstadoChat | "todos";
