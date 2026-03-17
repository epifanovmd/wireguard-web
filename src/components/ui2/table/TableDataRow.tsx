import { flexRender, type Row } from "@tanstack/react-table";
import * as React from "react";

import { cn } from "../cn";
import { TableCell, TableRow } from "./TablePrimitive";

interface TableDataRowProps<TData = unknown> {
  row: Row<TData>;
  isSelected: boolean;
  onRowClick?: (
    original: TData,
    e: React.MouseEvent<HTMLTableRowElement>,
  ) => void;
}

function TableDataRowInner<TData = unknown>({
  row,
  isSelected,
  onRowClick,
}: TableDataRowProps<TData>) {
  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLTableRowElement>) => onRowClick?.(row.original, e),
    [onRowClick, row.original],
  );

  return (
    <TableRow
      selected={isSelected}
      onClick={onRowClick ? handleClick : undefined}
      className={cn(onRowClick && "cursor-pointer")}
    >
      {row.getVisibleCells().map(cell => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

// Cast needed: React.memo doesn't support generic components directly
export const TableDataRow = React.memo(TableDataRowInner, (prev, next) => {
  return (
    prev.row.id === next.row.id &&
    prev.row.original === next.row.original &&
    prev.isSelected === next.isSelected &&
    prev.onRowClick === next.onRowClick
  );
}) as typeof TableDataRowInner;
