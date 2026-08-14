'use client';

import * as React from "react";
import { useState } from "react";

export interface TablaLocal<T> {
  /** La página actual, ya ordenada y recortada. */
  datos: T[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  handleSort: (key: string) => void;
  currentPage: number;
  pageSize: number;
  totalRows: number;
  setCurrentPage: (page: number) => void;
  /** Volver a la primera página. Llamar al cambiar un filtro. */
  reiniciarPagina: () => void;
}

export interface OpcionesTablaLocal {
  pageSize?: number;
  sortInicial?: string;
  ordenInicial?: "asc" | "desc";
}

/**
 * Orden y paginación en cliente, la parte que era idéntica en cuatro páginas.
 *
 * Recibe la lista **ya filtrada**: el filtrado varía de verdad entre módulos (campos
 * distintos, estados distintos) y se queda en cada feature. Aquí solo vive lo común.
 *
 * Los conjuntos son de decenas o pocos cientos de filas, así que se trae todo y se
 * recorta en memoria, que es lo que ya hacían las páginas.
 */
export function useTablaLocal<T>(
  filtrados: T[],
  { pageSize = 15, sortInicial = "", ordenInicial = "asc" }: OpcionesTablaLocal = {}
): TablaLocal<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(sortInicial);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(ordenInicial);

  const ordenados = React.useMemo(() => {
    if (!sortBy) return filtrados;
    return [...filtrados].sort((a, b) => {
      const valA = (a as Record<string, unknown>)[sortBy] ?? "";
      const valB = (b as Record<string, unknown>)[sortBy] ?? "";
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtrados, sortBy, sortOrder]);

  const datos = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return ordenados.slice(start, start + pageSize);
  }, [ordenados, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  return {
    datos,
    sortBy,
    sortOrder,
    handleSort,
    currentPage,
    pageSize,
    totalRows: filtrados.length,
    setCurrentPage,
    reiniciarPagina: () => setCurrentPage(1),
  };
}
