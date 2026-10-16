-- Reenviar invitaciones: el mismo token, siete días más desde hoy y un envío más.
--
-- Es una función y no un `update` desde la API porque PostgREST no sabe escribir
-- `envios = envios + 1`, y el reenvío masivo toca cientos de filas de una vez.
-- Las aceptadas no se tocan: su token ya se gastó.
create function public.reprogramar_invitaciones(p_ids uuid[], p_conjunto_id uuid)
returns setof uuid
language sql
security definer
set search_path = public
as $$
  update invitaciones
     set expira_en = now() + interval '7 days',
         envios    = envios + 1
   where id = any(p_ids)
     and conjunto_id = p_conjunto_id
     and not coalesce(usado, false)
  returning id;
$$;

revoke execute on function public.reprogramar_invitaciones(uuid[], uuid) from public, anon, authenticated;
