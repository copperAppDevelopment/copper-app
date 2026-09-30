-- Condonación de cargos.
--
-- La administración impone una multa y luego acuerda con el apartamento saldarla de otra forma:
-- el cargo tiene que dejar de contar sin borrarse. Se guarda CUÁNTO se perdonó y no un sí/no,
-- porque se condona solo lo que falta por pagar; lo ya abonado sigue siendo un pago.
--
-- `valor_condonado` es gemelo de `descuento_aplicado`, y entra en la misma fórmula:
--
--     saldo = valor_final − pagado − descuento_aplicado − valor_condonado
--
-- Con eso un cargo condonado queda en saldo cero y todo lo demás se corrige solo: los pagos no
-- le caen, la mora no lo cuenta y los avisos no lo cobran.
--
-- ⚠️ Esta migración no se puede reproducir desde cero: las anteriores no están versionadas, y
-- las funciones que aquí se modifican se parchean sobre su definición vigente en vez de
-- reescribirse. Cada parche comprueba que encontró exactamente lo que esperaba.

-- ---------------------------------------------------------------------------------------------
-- 1. Columnas
-- ---------------------------------------------------------------------------------------------
alter table public.cargos_mensuales
  add column valor_condonado  numeric not null default 0,
  add column condonado_motivo text,
  add column condonado_por    uuid references public.users(id) on delete set null,
  add column condonado_en     timestamptz,
  -- `greatest(..., 0)`: hay cargos con valor negativo (saldos a favor importados de Excel), y
  -- esos no tienen nada que condonar.
  add constraint cargos_condonado_rango
    check (valor_condonado >= 0 and valor_condonado <= greatest(valor_final, 0)),
  add constraint cargos_condonado_con_motivo
    check (valor_condonado = 0 or condonado_motivo is not null);

comment on column public.cargos_mensuales.valor_condonado is
  'Parte del cargo que la administración perdonó. Resta del saldo igual que descuento_aplicado.';

-- ---------------------------------------------------------------------------------------------
-- 2. Condonar y reactivar
-- ---------------------------------------------------------------------------------------------
create function public.condonar_cargo(
  p_cargo_id uuid, p_conjunto_id uuid, p_motivo text, p_usuario uuid
) returns numeric
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_cargo  record;
  v_pagado numeric;
  v_saldo  numeric;
begin
  if p_motivo is null or btrim(p_motivo) = '' then
    raise exception 'Hay que explicar el motivo de la condonación';
  end if;

  -- `for update`: dos administradores condonando a la vez no pueden pisarse.
  select id, conjunto_id, valor_final, descuento_aplicado, valor_condonado
    into v_cargo
    from cargos_mensuales
   where id = p_cargo_id
     for update;

  -- El mismo mensaje para «no existe» y «es de otro conjunto»: no se confirma a nadie la
  -- existencia de un cargo ajeno.
  if not found or v_cargo.conjunto_id <> p_conjunto_id then
    raise exception 'El cargo no existe en este conjunto';
  end if;

  if v_cargo.valor_condonado > 0 then
    raise exception 'Este cargo ya está condonado';
  end if;

  select coalesce(sum(valor_aplicado), 0) into v_pagado
    from cargos_recaudos where cargo_id = p_cargo_id;

  v_saldo := v_cargo.valor_final - v_pagado - v_cargo.descuento_aplicado;

  if v_saldo <= 0 then
    raise exception 'Este cargo no debe nada: no queda saldo por condonar';
  end if;

  update cargos_mensuales
     set valor_condonado  = v_saldo,
         condonado_motivo = btrim(p_motivo),
         condonado_por    = p_usuario,
         condonado_en     = now()
   where id = p_cargo_id;

  return v_saldo;
end;
$$;

create function public.reactivar_cargo(p_cargo_id uuid, p_conjunto_id uuid)
returns numeric
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_cargo record;
begin
  select id, conjunto_id, valor_condonado
    into v_cargo
    from cargos_mensuales
   where id = p_cargo_id
     for update;

  if not found or v_cargo.conjunto_id <> p_conjunto_id then
    raise exception 'El cargo no existe en este conjunto';
  end if;

  if v_cargo.valor_condonado = 0 then
    raise exception 'Este cargo no está condonado';
  end if;

  update cargos_mensuales
     set valor_condonado  = 0,
         condonado_motivo = null,
         condonado_por    = null,
         condonado_en     = null
   where id = p_cargo_id;

  return v_cargo.valor_condonado;
end;
$$;

-- Solo el servidor. Se revoca de `public` —que es a quien Postgres concede EXECUTE por
-- defecto— y también de `anon` y `authenticated` por nombre, porque Supabase les concede
-- privilegios explícitos sobre lo que se crea en `public`. Con una sola de las dos no basta.
revoke all on function public.condonar_cargo(uuid, uuid, text, uuid) from public, anon, authenticated;
revoke all on function public.reactivar_cargo(uuid, uuid)            from public, anon, authenticated;
grant execute on function public.condonar_cargo(uuid, uuid, text, uuid) to service_role;
grant execute on function public.reactivar_cargo(uuid, uuid)            to service_role;

-- ---------------------------------------------------------------------------------------------
-- 3. Funciones y vistas que calculan el saldo
--
-- Se parchean sobre su definición actual en vez de reescribirse a mano: son largas, y copiar
-- 150 líneas de SQL para cambiar una es la forma más fácil de colar un error en la facturación.
-- Cada parche exige el número exacto de coincidencias; si la definición cambió, falla entera.
-- ---------------------------------------------------------------------------------------------
do $parche$
declare
  v_def   text;
  v_nuevo text;
  v_n     int;
begin
  -- aplicar_recaudo: el saldo aparece en el SELECT y en el HAVING.
  v_def := pg_get_functiondef('public.aplicar_recaudo(uuid)'::regprocedure);
  v_n := (length(v_def) - length(replace(v_def, '- cm.descuento_aplicado', ''))) / length('- cm.descuento_aplicado');
  if v_n <> 2 then raise exception 'aplicar_recaudo: se esperaban 2 coincidencias y hay %', v_n; end if;
  execute replace(v_def, '- cm.descuento_aplicado', '- cm.descuento_aplicado - cm.valor_condonado');

  -- generar_cargos_mensuales: solo la base de la mora. El `not exists` que decide qué facturar
  -- NO se toca: un cargo condonado sigue ocupando su sitio, o el cron lo regeneraría.
  v_def := pg_get_functiondef('public.generar_cargos_mensuales(text)'::regprocedure);
  v_n := (length(v_def) - length(replace(v_def, '- cm.descuento_aplicado', ''))) / length('- cm.descuento_aplicado');
  if v_n <> 1 then raise exception 'generar_cargos_mensuales: se esperaba 1 coincidencia y hay %', v_n; end if;
  execute replace(v_def, '- cm.descuento_aplicado', '- cm.descuento_aplicado - cm.valor_condonado');

  -- notificar_cobros_diario: el saldo del periodo, y el descuento por pronto pago, que no se
  -- ofrece sobre un cargo que ya no debe nada.
  v_def := pg_get_functiondef('public.notificar_cobros_diario(date)'::regprocedure);
  v_n := (length(v_def) - length(replace(v_def, '- cm.descuento_aplicado)', ''))) / length('- cm.descuento_aplicado)');
  if v_n <> 1 then raise exception 'notificar_cobros_diario (saldo): se esperaba 1 coincidencia y hay %', v_n; end if;
  v_nuevo := replace(v_def, '- cm.descuento_aplicado)', '- cm.descuento_aplicado - cm.valor_condonado)');
  v_n := (length(v_nuevo) - length(replace(v_nuevo, 'and cm.valor_final - coalesce(p.pagado, 0) > 0', ''))) / length('and cm.valor_final - coalesce(p.pagado, 0) > 0');
  if v_n <> 1 then raise exception 'notificar_cobros_diario (descuento): se esperaba 1 coincidencia y hay %', v_n; end if;
  execute replace(v_nuevo, 'and cm.valor_final - coalesce(p.pagado, 0) > 0', 'and cm.valor_final - coalesce(p.pagado, 0) - cm.valor_condonado > 0');

  -- revertir_cobro_manual: un cargo condonado no se borra, porque se llevaría el rastro del
  -- acuerdo. Cuenta como bloqueado, igual que uno con pagos.
  v_def := pg_get_functiondef('public.revertir_cobro_manual(uuid, text, text)'::regprocedure);
  v_n := (length(v_def) - length(replace(v_def, 'and not exists (select 1 from public.cargos_recaudos cr where cr.cargo_id = cm.id)', ''))) / length('and not exists (select 1 from public.cargos_recaudos cr where cr.cargo_id = cm.id)');
  if v_n <> 1 then raise exception 'revertir_cobro_manual (borrado): se esperaba 1 coincidencia y hay %', v_n; end if;
  v_nuevo := replace(v_def,
    'and not exists (select 1 from public.cargos_recaudos cr where cr.cargo_id = cm.id)',
    'and cm.valor_condonado = 0 and not exists (select 1 from public.cargos_recaudos cr where cr.cargo_id = cm.id)');
  v_n := (length(v_nuevo) - length(replace(v_nuevo, 'and exists (select 1 from public.cargos_recaudos cr where cr.cargo_id = cm.id)', ''))) / length('and exists (select 1 from public.cargos_recaudos cr where cr.cargo_id = cm.id)');
  if v_n <> 1 then raise exception 'revertir_cobro_manual (bloqueados): se esperaba 1 coincidencia y hay %', v_n; end if;
  execute replace(v_nuevo,
    'and exists (select 1 from public.cargos_recaudos cr where cr.cargo_id = cm.id)',
    'and (cm.valor_condonado > 0 or exists (select 1 from public.cargos_recaudos cr where cr.cargo_id = cm.id))');

  -- Las dos vistas de saldo: misma fórmula.
  v_def := pg_get_viewdef('public.vista_mis_balances_indicadores'::regclass, true);
  v_n := (length(v_def) - length(replace(v_def, '- cm.descuento_aplicado AS saldo', ''))) / length('- cm.descuento_aplicado AS saldo');
  if v_n <> 1 then raise exception 'vista_mis_balances_indicadores: se esperaba 1 coincidencia y hay %', v_n; end if;
  execute 'create or replace view public.vista_mis_balances_indicadores as '
       || replace(v_def, '- cm.descuento_aplicado AS saldo', '- cm.descuento_aplicado - cm.valor_condonado AS saldo');

  v_def := pg_get_viewdef('public.vista_dashboard_residente'::regclass, true);
  v_n := (length(v_def) - length(replace(v_def, '- cm.descuento_aplicado AS saldo', ''))) / length('- cm.descuento_aplicado AS saldo');
  if v_n <> 1 then raise exception 'vista_dashboard_residente: se esperaba 1 coincidencia y hay %', v_n; end if;
  execute 'create or replace view public.vista_dashboard_residente as '
       || replace(v_def, '- cm.descuento_aplicado AS saldo', '- cm.descuento_aplicado - cm.valor_condonado AS saldo');

  -- El historial gana una cuarta rama: la condonación como movimiento a favor, igual que ya se
  -- hace con el descuento por pronto pago. Va como 'PAGO' para que las apps ya publicadas, que
  -- solo conocen CARGO y PAGO, la pinten del lado correcto. El nombre del concepto viaja en
  -- `origen_pago`, que es lo único que esas apps muestran de un pago.
  v_def := rtrim(pg_get_viewdef('public.vista_mis_balances_historial2'::regclass, true), E'; \n');
  execute 'create or replace view public.vista_mis_balances_historial2 as ' || v_def || $rama$
  UNION ALL
   SELECT r.id AS residente_id,
      u.id AS user_id,
      a.conjunto_id,
      a.id AS apartamento_id,
      cm.periodo,
      -- La columna es `timestamp` sin zona, como `fecha_generado`, que se guarda en UTC.
      (cm.condonado_en AT TIME ZONE 'UTC') AS fecha_movimiento,
      NULL::date AS fecha_vencimiento,
      'PAGO'::text AS movimiento_tipo,
      NULL::text AS concepto_cargo,
      'Cargo condonado: '::text || cc.nombre AS origen_pago,
      0::numeric AS debito,
      cm.valor_condonado AS credito
     FROM apartamentos a
       JOIN cargos_mensuales cm ON cm.apartamento_id = a.id
       JOIN conceptos_cobro cc ON cc.id = cm.concepto_id
       LEFT JOIN residentes r ON r.apartamento_id = a.id
       LEFT JOIN users u ON u.id = r.user_id
    WHERE cm.valor_condonado > 0::numeric
  $rama$;
end;
$parche$;

-- ---------------------------------------------------------------------------------------------
-- 4. Saldos por concepto: además de la condonación, un error que ya traía
--
-- `total_pagado` era un 0 fijo y la vista descartaba cualquier cargo con un abono, aunque fuera
-- parcial: un cargo de 500.000 con 100.000 abonados desaparecía en vez de mostrar 400.000.
-- Ahora entra todo cargo que siga debiendo algo, con lo facturado, lo abonado y el saldo.
-- ---------------------------------------------------------------------------------------------
create or replace view public.vista_saldos_por_concepto_residente as
with pagos as (
  select cargo_id, sum(valor_aplicado) as pagado
  from cargos_recaudos
  group by cargo_id
)
select r.user_id,
       r.id as residente_id,
       r.apartamento_id,
       cc.id as concepto_id,
       cc.codigo,
       cc.nombre,
       sum(cm.valor_final) as total_cargos,
       sum(coalesce(p.pagado, 0::numeric)) as total_pagado,
       sum(cm.valor_final - coalesce(p.pagado, 0::numeric) - cm.descuento_aplicado - cm.valor_condonado) as saldo,
       min(cm.fecha_vencimiento) as proximo_vencimiento
from residentes r
  join cargos_mensuales cm on cm.apartamento_id = r.apartamento_id
  join conceptos_cobro cc on cc.id = cm.concepto_id
  left join pagos p on p.cargo_id = cm.id
where cm.valor_final - coalesce(p.pagado, 0::numeric) - cm.descuento_aplicado - cm.valor_condonado > 0::numeric
group by r.user_id, r.id, r.apartamento_id, cc.id, cc.codigo, cc.nombre;

-- ---------------------------------------------------------------------------------------------
-- 5. La vista del módulo de Cargos: un cargo por fila, con su estado
-- ---------------------------------------------------------------------------------------------
create view public.vista_cargos_admin as
with pagos as (
  select cargo_id, sum(valor_aplicado) as pagado
  from cargos_recaudos
  group by cargo_id
)
select cm.id,
       cm.conjunto_id,
       cm.apartamento_id,
       d.numero_apt,
       d.nombre_torre,
       cm.periodo,
       cm.concepto_id,
       cc.codigo as concepto_codigo,
       cc.nombre as concepto_nombre,
       cm.origen,
       cm.valor_final,
       coalesce(p.pagado, 0::numeric) as pagado,
       cm.descuento_aplicado,
       cm.valor_condonado,
       cm.valor_final - coalesce(p.pagado, 0::numeric) - cm.descuento_aplicado - cm.valor_condonado as saldo,
       cm.fecha_generado,
       cm.fecha_vencimiento,
       cm.condonado_motivo,
       cm.condonado_en,
       nullif(btrim(concat(u.nombres, ' ', u.apellidos)), '') as condonado_por_nombre,
       case
         when cm.valor_condonado > 0 then 'condonado'
         when cm.valor_final - coalesce(p.pagado, 0::numeric) - cm.descuento_aplicado <= 0 then 'pagado'
         when coalesce(p.pagado, 0::numeric) > 0 then 'abonado'
         else 'pendiente'
       end as estado
from cargos_mensuales cm
  join conceptos_cobro cc on cc.id = cm.concepto_id
  left join vista_detalle_apt d on d.id_apt = cm.apartamento_id
  left join pagos p on p.cargo_id = cm.id
  left join users u on u.id = cm.condonado_por;
