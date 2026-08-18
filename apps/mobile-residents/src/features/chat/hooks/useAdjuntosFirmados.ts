import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import type { ChatMessage } from './useChatRoom';

/** Una hora: sobra para ver un adjunto sin re-firmar en cada render de la lista. */
const SEGUNDOS_FIRMA = 3600;

/**
 * URLs firmadas de los adjuntos, indexadas por `file_name`.
 *
 * El bucket `chat_files` pasó a ser privado: las conversaciones entre residente y
 * administración eran accesibles por URL para cualquiera. Antes esta pantalla construía
 * `/object/public/chat_files/...` a mano, y esa ruta ya no responde.
 */
export function useAdjuntosFirmados(messages: ChatMessage[]): Record<string, string> {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const pedidos = useRef<Set<string>>(new Set());

  useEffect(() => {
    const pendientes = messages
      .map((m) => m.file_name)
      .filter((p): p is string => Boolean(p) && !pedidos.current.has(p!));

    if (pendientes.length === 0) return;

    pendientes.forEach((p) => pedidos.current.add(p));

    Promise.all(
      pendientes.map(async (path) => {
        const { data, error } = await supabase.storage
          .from('chat_files')
          .createSignedUrl(path, SEGUNDOS_FIRMA);

        if (error) {
          console.error('No se pudo firmar el adjunto:', error);
          // Se reintenta en el próximo cambio de la lista.
          pedidos.current.delete(path);
          return null;
        }
        return [path, data.signedUrl] as const;
      })
    ).then((pares) => {
      const nuevos = Object.fromEntries(
        pares.filter((par): par is readonly [string, string] => par !== null)
      );
      if (Object.keys(nuevos).length > 0) {
        setUrls((previos) => ({ ...previos, ...nuevos }));
      }
    });
  }, [messages]);

  return urls;
}
