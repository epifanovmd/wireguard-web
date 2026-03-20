import { Table } from "@tanstack/react-table";
import { useMemo } from "react";

/**
 * Computes percentage-based column widths from TanStack table column sizes.
 * Used to keep header and body tables visually aligned in fillHeight mode.
 */
export const useTableColWidths = <TData,>(table: Table<TData>) =>
  useMemo(() => {
    const cols = table.getAllLeafColumns();
    const total = cols.reduce((sum, col) => sum + col.getSize(), 0);

    return cols.map(col => ({
      id: col.id,
      width: `${(col.getSize() / total) * 100}%`,
    }));
  }, [table]);
