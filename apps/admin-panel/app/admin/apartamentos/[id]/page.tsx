'use client';

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";
import { AdminPageShell } from "@/components/layout/admin-page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import {
  IndicadoresBalanceCards,
  MovimientosTabla,
} from "@/components/balances/estado-de-cuenta";
import { useDetalleApartamento } from "@/features/apartamentos/hooks/useDetalleApartamento";
import { ResidentesDelApartamento } from "@/features/apartamentos/components/ResidentesDelApartamento";

export default function DetalleApartamentoPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const sesion = useAdminSession();
  const d = useDetalleApartamento(params?.id ?? "", sesion.loading);

  const subtitulo = [
    d.detalle?.nombre_conjunto?.trim(),
    d.detalle?.nombre_torre,
    d.detalle?.numero_piso != null ? `Piso ${d.detalle.numero_piso}` : null,
  ].filter(Boolean).join(" · ");

  return (
    <AdminPageShell
      sesion={sesion}
      active="apartamentos"
      loading={d.loading}
      titulo={d.detalle ? `Apartamento ${d.detalle.numero_apt}` : "Apartamento"}
      subtitulo={subtitulo}
      tituloAdorno={
        d.detalle && (
          <Badge variant={d.detalle.ocupado ? "success" : "neutral"}>
            {d.detalle.ocupado ? "Ocupado" : "Vacío"}
          </Badge>
        )
      }
      encabezado={
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.push("/admin/apartamentos")}
          className="-ml-3"
        >
          Volver a apartamentos
        </Button>
      }
    >
      {d.error ? (
        <Alert variant="danger" title="No se pudo abrir el apartamento">{d.error}</Alert>
      ) : (
        <>
          <IndicadoresBalanceCards indicadores={d.indicadores} />
          <ResidentesDelApartamento residentes={d.residentes} />
          <MovimientosTabla
            movimientos={d.movimientos}
            emptyMessage="Este apartamento no tiene movimientos registrados."
          />
        </>
      )}
    </AdminPageShell>
  );
}
