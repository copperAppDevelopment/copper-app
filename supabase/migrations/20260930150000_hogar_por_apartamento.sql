-- El hogar es del apartamento, no del residente.
--
-- `convivientes`, `empleados_servicio`, `mascotas` y `vehiculos` colgaban de `residente_id`. Pero
-- un apartamento puede tener varios residentes y lo que registran —el carro, el perro, la
-- empleada— es del hogar: el segundo residente veía su perfil vacío, y borrar a un residente se
-- llevaba en cascada el carro de todo el apartamento.
--
-- Ahora cada registro pertenece a un `apartamento_id`. `registrado_por` solo dice quién lo creó, y
-- `archivado_en` lo saca de circulación cuando el apartamento se queda sin residentes activos: el
-- próximo inquilino empieza en blanco y el carro del anterior deja de estar autorizado.

-- ---------------------------------------------------------------------------------------------
-- 1. Columnas nuevas, rellenas desde el residente que registró cada fila
-- ---------------------------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array['convivientes', 'empleados_servicio', 'mascotas', 'vehiculos'] loop
    execute format(
      'alter table public.%1$I
         add column apartamento_id uuid references public.apartamentos(id) on delete cascade,
         add column registrado_por uuid references public.residentes(id) on delete set null,
         add column archivado_en   timestamptz', t);

    execute format(
      'update public.%1$I x
          set apartamento_id = r.apartamento_id,
              registrado_por = r.id,
              -- Si el apartamento ya no tiene a nadie activo, lo registrado es de otro inquilino.
              archivado_en = case
                when exists (select 1 from public.residentes o
                              where o.apartamento_id = r.apartamento_id and o.activo)
                then null else now() end
         from public.residentes r
        where r.id = x.residente_id', t);

    -- Un residente sin apartamento no deja a quién asignar el registro. Hoy no hay ninguno; si
    -- apareciera, la migración debe fallar aquí y no borrarlo en silencio.
    execute format('alter table public.%1$I alter column apartamento_id set not null', t);

    execute format(
      'create index %1$s_apartamento_vigente_idx on public.%1$I (apartamento_id)
        where archivado_en is null', t);

    -- La escritura va siempre por la API con service_role. Con la anon key, que viaja en la app,
    -- cualquiera podía borrar el carro de cualquier apartamento.
    execute format(
      'revoke insert, update, delete, truncate on public.%1$I from anon, authenticated', t);

    execute format(
      'comment on column public.%1$I.registrado_por is
         ''Quién lo registró. Solo informativo: cualquier residente activo del apartamento lo edita.''', t);
    execute format(
      'comment on column public.%1$I.archivado_en is
         ''Se llena solo cuando el apartamento queda sin residentes activos. NULL = vigente.''', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------------------------
-- 2. Vistas: van por apartamento y omiten lo archivado
-- ---------------------------------------------------------------------------------------------
-- Las columnas conservan nombre y orden. Un residente que ya no está activo no muestra el hogar
-- actual de su antiguo apartamento.
create or replace view public.vista_residente_completo as
select r.id as residente_id,
       r.user_id,
       u.nombres,
       u.apellidos,
       u.tipo_documento,
       u.documento,
       u.email,
       u.phone_number,
       u.direccion as direccion_personal,
       u.foto_url,
       u.estado,
       u.rol,
       r.conjunto_id,
       c.nombre as nombre_conjunto,
       r.direccion_unidad,
       r.estrato,
       r.ano_ingreso,
       r.apartamento_id,
       a.numero_apartamento,
       (select coalesce(json_agg(to_jsonb(v) || jsonb_build_object('registrado_por_nombre',
                 nullif(concat_ws(' ', trim(ru.nombres), trim(ru.apellidos)), '')) order by v.id), '[]'::json)
          from public.vehiculos v
          left join public.residentes rr on rr.id = v.registrado_por
          left join public.users ru on ru.id = rr.user_id
         where r.activo and v.apartamento_id = r.apartamento_id and v.archivado_en is null) as vehiculos,
       (select coalesce(json_agg(to_jsonb(m) || jsonb_build_object('registrado_por_nombre',
                 nullif(concat_ws(' ', trim(ru.nombres), trim(ru.apellidos)), '')) order by m.id), '[]'::json)
          from public.mascotas m
          left join public.residentes rr on rr.id = m.registrado_por
          left join public.users ru on ru.id = rr.user_id
         where r.activo and m.apartamento_id = r.apartamento_id and m.archivado_en is null) as mascotas,
       (select coalesce(json_agg(to_jsonb(cv) || jsonb_build_object('registrado_por_nombre',
                 nullif(concat_ws(' ', trim(ru.nombres), trim(ru.apellidos)), '')) order by cv.id), '[]'::json)
          from public.convivientes cv
          left join public.residentes rr on rr.id = cv.registrado_por
          left join public.users ru on ru.id = rr.user_id
         where r.activo and cv.apartamento_id = r.apartamento_id and cv.archivado_en is null) as convivientes,
       (select coalesce(json_agg(to_jsonb(e) || jsonb_build_object('registrado_por_nombre',
                 nullif(concat_ws(' ', trim(ru.nombres), trim(ru.apellidos)), '')) order by e.id), '[]'::json)
          from public.empleados_servicio e
          left join public.residentes rr on rr.id = e.registrado_por
          left join public.users ru on ru.id = rr.user_id
         where r.activo and e.apartamento_id = r.apartamento_id and e.archivado_en is null) as empleados_servicio
  from public.residentes r
  join public.users u on r.user_id = u.id
  left join public.conjuntos c on r.conjunto_id = c.id
  left join public.apartamentos a on r.apartamento_id = a.id;

-- No las usa ningún código del repo, pero se conservan con las mismas columnas por si algo
-- externo las lee.
create or replace view public.vista_personas_apartamento as
select concat_ws(' ', u.nombres, u.apellidos) as nombres_completos,
       u.email,
       'usuario'::text as tipo_persona,
       r.apartamento_id,
       a.numero_apartamento
  from public.users u
  join public.residentes r on u.id = r.user_id
  left join public.apartamentos a on r.apartamento_id = a.id
union all
select concat_ws(' ', c.nombres, c.apellidos),
       null::text,
       'conviviente'::text,
       c.apartamento_id,
       a.numero_apartamento
  from public.convivientes c
  left join public.apartamentos a on c.apartamento_id = a.id
 where c.archivado_en is null;

create or replace view public.vista_residentes_convivientes as
select u.id as user_id,
       u.nombres as user_nombres,
       u.apellidos as user_apellidos,
       u.email,
       u.rol,
       u.estado,
       u.phone_number,
       u.direccion,
       r.id as residente_id,
       r.apartamento_id,
       a.numero_apartamento,
       a.direccion as direccion_apartamento,
       null::text as conviviente_nombres,
       null::text as conviviente_apellidos,
       null::text as parentesco,
       null::timestamptz as fecha_nacimiento,
       'usuario'::text as tipo_persona
  from public.users u
  join public.residentes r on u.id = r.user_id
  left join public.apartamentos a on r.apartamento_id = a.id
union all
select null::uuid,
       c.nombres,
       c.apellidos,
       null::text,
       null::text,
       null::boolean,
       null::varchar,
       null::varchar,
       c.registrado_por,
       c.apartamento_id,
       a.numero_apartamento,
       a.direccion,
       c.nombres,
       c.apellidos,
       c.parentesco,
       c.fecha_nacimiento,
       'conviviente'::text
  from public.convivientes c
  left join public.apartamentos a on c.apartamento_id = a.id
 where c.archivado_en is null;

-- ---------------------------------------------------------------------------------------------
-- 3. Fuera `residente_id` (y con él su FK en cascada)
-- ---------------------------------------------------------------------------------------------
alter table public.convivientes       drop column residente_id;
alter table public.empleados_servicio drop column residente_id;
alter table public.mascotas           drop column residente_id;
alter table public.vehiculos          drop column residente_id;

-- ---------------------------------------------------------------------------------------------
-- 4. Archivar al desocupar
-- ---------------------------------------------------------------------------------------------
-- En la base y no en la ruta de «remover», para que cubra cualquier camino: remover, reasignar a
-- otro apartamento o borrar a mano. Reocupar el apartamento NO desarchiva: el nuevo inquilino
-- empieza en blanco.
create function public.archivar_hogar_al_desocupar()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_apto uuid := old.apartamento_id;
begin
  if v_apto is null then
    return null;
  end if;

  -- Sigue en el mismo apartamento y activo: no se desocupó nada.
  if tg_op = 'UPDATE' and new.activo and new.apartamento_id is not distinct from v_apto then
    return null;
  end if;

  if exists (select 1 from residentes where apartamento_id = v_apto and activo) then
    return null;
  end if;

  update convivientes       set archivado_en = now() where apartamento_id = v_apto and archivado_en is null;
  update empleados_servicio set archivado_en = now() where apartamento_id = v_apto and archivado_en is null;
  update mascotas           set archivado_en = now() where apartamento_id = v_apto and archivado_en is null;
  update vehiculos          set archivado_en = now() where apartamento_id = v_apto and archivado_en is null;

  return null;
end;
$$;

revoke execute on function public.archivar_hogar_al_desocupar() from public, anon, authenticated;

create trigger archivar_hogar_al_desocupar
  after update of activo, apartamento_id or delete on public.residentes
  for each row execute function public.archivar_hogar_al_desocupar();
