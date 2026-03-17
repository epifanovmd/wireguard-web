import { flexRender, type Row } from "@tanstack/react-table";
import * as React from "react";

import { cn } from "../cn";
import { TableCell, TableRow } from "./TablePrimitive";

interface TableDataRowProps {
  row: Row<any>;
  onRowClick?: (
    original: any,
    e: React.MouseEvent<HTMLTableRowElement>,
  ) => void;
}

export const TableDataRow = React.memo(
  function TableDataRow({ row, onRowClick }: TableDataRowProps) {
    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLTableRowElement>) =>
        onRowClick?.(row.original, e),
      [onRowClick, row.original],
    );

    return (
      <TableRow
        selected={row.getIsSelected()}
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
  },
  (prev, next) =>
    prev.row.id === next.row.id &&
    prev.row.original === next.row.original &&
    prev.row.getIsSelected() === next.row.getIsSelected() &&
    prev.onRowClick === next.onRowClick,
);
