import * as React from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export interface TableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface CommonTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (key: string) => void;
  currentPage?: number;
  pageSize?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  /** `ReactNode` y no `string` para que el estado vacío pueda ofrecer una salida, como
   *  «quita el filtro», y no solo describir lo que no hay. */
  emptyMessage?: React.ReactNode;
}

export function CommonTable<T>({
  columns,
  data = [],
  loading = false,
  sortBy,
  sortOrder,
  onSort,
  currentPage,
  pageSize,
  totalRows,
  onPageChange,
  emptyMessage = "No hay datos para mostrar",
}: CommonTableProps<T>) {
  
  // Calculate total pages for pagination controls
  const totalPages = totalRows && pageSize ? Math.ceil(totalRows / pageSize) : 1;

  const handleSortClick = (column: TableColumn<T>) => {
    if (column.sortable && onSort) {
      onSort(column.key);
    }
  };

  return (
    <div className="flex flex-col w-full h-full justify-between">
      {/* Table grid */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-zinc-150 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 uppercase font-semibold text-[10px] tracking-wider select-none">
              {columns.map((col) => {
                const isSorted = sortBy === col.key;
                return (
                  <th
                    key={col.key}
                    onClick={() => handleSortClick(col)}
                    className={`py-3 px-3.5 transition-colors ${
                      col.sortable ? "cursor-pointer hover:text-zinc-800 dark:hover:text-white" : ""
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && (
                        <span className="text-zinc-400 dark:text-zinc-500 flex flex-col -space-y-1">
                          {isSorted && sortOrder === "asc" ? (
                            <ChevronUp className="w-3 h-3 text-brand" />
                          ) : isSorted && sortOrder === "desc" ? (
                            <ChevronDown className="w-3 h-3 text-brand" />
                          ) : (
                            <div className="flex flex-col -space-y-1.5 opacity-40">
                              <ChevronUp className="w-2.5 h-2.5" />
                              <ChevronDown className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
            {loading ? (
              // Skeleton state
              Array.from({ length: pageSize || 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse" role="status">
                  {columns.map((col) => (
                    <td key={col.key} className="py-4 px-3.5">
                      <div className="h-3 bg-zinc-150 dark:bg-zinc-800 rounded-md w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty state
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-zinc-500 dark:text-zinc-400">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <p className="font-semibold text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Main data rows
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-zinc-550/5 dark:hover:bg-zinc-850/20 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="py-3.5 px-3.5 text-zinc-700 dark:text-zinc-300">
                      {col.render ? col.render(row, rowIndex) : (row as any)[col.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination panel */}
      {currentPage && onPageChange && totalPages > 1 && (
        <div className="flex justify-between items-center px-4 py-3.5 border-t border-zinc-150 dark:border-zinc-800/80 bg-zinc-50/30 dark:bg-zinc-950/10 text-xs text-zinc-500 dark:text-zinc-400 font-light select-none">
          <div>
            Mostrando pág. <b>{currentPage}</b> de <b>{totalPages}</b>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="p-1.5 border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-850 dark:hover:bg-zinc-800 rounded-lg disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer text-zinc-600 dark:text-zinc-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {/* Page number buttons */}
            {Array.from({ length: totalPages }).map((_, idx) => {
              const p = idx + 1;
              const isCurrent = p === currentPage;
              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  disabled={loading}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-brand text-white shadow-sm"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-300"
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="p-1.5 border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-850 dark:hover:bg-zinc-800 rounded-lg disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer text-zinc-600 dark:text-zinc-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
