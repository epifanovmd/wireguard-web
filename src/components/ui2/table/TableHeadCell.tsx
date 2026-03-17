import { flexRender,type Header } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import * as React from "react";

import { TableHead } from "./TablePrimitive";

interface SortIconProps {
  direction: "asc" | "desc" | false;
}

const SortIcon = ({ direction }: SortIconProps) => {
  if (direction === "asc") return <ArrowUp className="h-3.5 w-3.5 shrink-0" />;
  if (direction === "desc") return <ArrowDown className="h-3.5 w-3.5 shrink-0" />;

  return <ArrowUpDown className="h-3.5 w-3.5 shrink-0 opacity-40" />;
};

interface TableHeadCellProps {
  header: Header<any, unknown>;
  sorting?: boolean;
}

export const TableHeadCell = React.memo(function TableHeadCell({
  header,
  sorting,
}: TableHeadCellProps) {
  if (header.isPlaceholder) {
    return <TableHead colSpan={header.colSpan} />;
  }

  const content = flexRender(header.column.columnDef.header, header.getContext());
  const canSort = sorting && header.column.getCanSort();

  return (
    <TableHead colSpan={header.colSpan}>
      {canSort ? (
        <button
          type="button"
          className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
          onClick={header.column.getToggleSortingHandler()}
        >
          {content}
          <SortIcon direction={header.column.getIsSorted()} />
        </button>
      ) : (
        content
      )}
    </TableHead>
  );
});
