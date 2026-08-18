'use client';

import * as React from "react";
import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";

export interface QrModalProps {
  isOpen: boolean;
  conjuntoId: string;
  nombre: string;
  onClose: () => void;
}

/** Nombre de archivo legible y seguro para el PNG descargado. */
const nombreArchivo = (nombre: string) =>
  `qr-${nombre.normalize("NFD").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase().replace(/^-|-$/g, "") || "conjunto"}.png`;

/**
 * QR de vinculación del conjunto.
 *
 * El contenido es el UUID en texto plano, sin prefijo ni JSON: el escáner de
 * `apps/mobile-residents/app/register.tsx` mete lo leído tal cual en el campo del
 * conjunto, así que cualquier envoltorio rompería el registro de residentes.
 */
export function QrModal({ isOpen, conjuntoId, nombre, onClose }: QrModalProps) {
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !conjuntoId) return;
    let cancelado = false;

    QRCode.toDataURL(conjuntoId, {
      width: 512,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#18181b", light: "#ffffff" },
    })
      .then(url => { if (!cancelado) { setDataUrl(url); setError(""); } })
      .catch(e => {
        console.error("Error al generar el QR:", e);
        if (!cancelado) setError("No se pudo generar el código QR.");
      });

    return () => { cancelado = true; };
  }, [isOpen, conjuntoId]);

  const descargar = () => {
    const enlace = document.createElement("a");
    enlace.href = dataUrl;
    enlace.download = nombreArchivo(nombre);
    enlace.click();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Código QR del conjunto"
      description="Los residentes lo escanean al registrarse en la app para quedar vinculados a este conjunto."
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cerrar</Button>
          <Button onClick={descargar} disabled={!dataUrl} icon={<Download className="w-4 h-4" />}>
            Descargar PNG
          </Button>
        </>
      }
    >
      {error && <Alert variant="danger">{error}</Alert>}

      {dataUrl && (
        <div className="flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dataUrl}
            alt={`Código QR de ${nombre}`}
            className="w-56 h-56 rounded-2xl border border-zinc-200 dark:border-zinc-800"
          />
          <p className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 break-all text-center">
            {conjuntoId}
          </p>
        </div>
      )}
    </Modal>
  );
}
