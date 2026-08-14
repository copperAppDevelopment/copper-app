'use client';

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";
import { AdminPageShell } from "@/components/layout/admin-page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { nombreCompleto } from "@/lib/formato";
import {
  IndicadoresBalanceCards,
  MovimientosTabla,
} from "@/components/balances/estado-de-cuenta";
import { useDetalleResidente } from "@/features/residentes/hooks/useDetalleResidente";
import { InformacionResidente } from "@/features/residentes/components/InformacionResidente";
import { SubColecciones } from "@/features/residentes/components/SubColecciones";

export default function DetalleResidentePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const sesion = useAdminSession();
  const d = useDetalleResidente(params?.id ?? "", sesion.loading);

  const estado =
    d.activo === false
      ? <Badge variant="neutral">Inactivo</Badge>
      : d.residente?.apartamento_id
        ? <Badge variant="success">Activo</Badge>
        : <Badge variant="warning">Pendiente</Badge>;

  const subtitulo = [
    d.residente?.nombre_conjunto?.trim(),
    d.residente?.numero_apartamento ? `Apto ${d.residente.numero_apartamento}` : "Sin apartamento",
  ].filter(Boolean).join(" · ");

  return (
    <AdminPageShell
      sesion={sesion}
      active="residentes"
      loading={d.loading}
      titulo={nombreCompleto(d.residente)}
      tituloAdorno={d.residente && estado}
      subtitulo={subtitulo}
      encabezado={
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.push("/admin/residentes")}
          className="-ml-3"
        >
          Volver a residentes
        </Button>
      }
      acciones={
        d.residente?.foto_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={d.residente.foto_url}
            alt={nombreCompleto(d.residente)}
            className="w-14 h-14 rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
            <User className="w-6 h-6" />
          </div>
        )
      }
    >
      {d.error ? (
        <Alert variant="danger" title="No se pudo abrir el residente">{d.error}</Alert>
      ) : (
        <>
          <IndicadoresBalanceCards indicadores={d.indicadores} />
          <InformacionResidente residente={d.residente} />
          <SubColecciones residente={d.residente} />
          <MovimientosTabla
            movimientos={d.movimientos}
            emptyMessage={
              d.residente?.apartamento_id
                ? "Este residente no tiene movimientos registrados."
                : "Sin apartamento asignado no se generan cargos, así que no hay movimientos."
            }
          />
        </>
      )}
    </AdminPageShell>
  );
}
