-- Control del envío de las invitaciones.
--
-- El panel ahora lista las invitaciones y permite reenviarlas, así que hace falta saber cuántas
-- veces se mandó cada una, cuándo fue la última y si Resend la rechazó. Antes el envío lo hacía
-- la edge function `invite-user` y su resultado no quedaba en ninguna parte.

alter table public.invitaciones
  add column ultimo_envio_en timestamptz,
  add column envios          integer not null default 1,
  add column error_envio     text,
  add constraint invitaciones_envios_positivos check (envios >= 1);

-- Las existentes se enviaron una vez, al crearse.
update public.invitaciones set ultimo_envio_en = creado_en where ultimo_envio_en is null;

alter table public.invitaciones alter column ultimo_envio_en set default now();

comment on column public.invitaciones.error_envio is
  'Respuesta de Resend si el último envío falló. NULL = se envió bien.';

-- El listado del panel filtra por conjunto y ordena por fecha.
create index if not exists invitaciones_conjunto_creado_idx
  on public.invitaciones (conjunto_id, creado_en desc);

-- El token es la única credencial para crear la cuenta del invitado (incluidas invitaciones de
-- Admin). `anon` podía leerlos todos con la anon key de la app, y además crear y borrar filas.
-- Solo el servidor usa esta tabla, con service_role.
revoke all on public.invitaciones from anon, authenticated;
