import * as React from "react";

import { cn } from "../cn";
import { TableHeadCell } from "./TableHeadCell";
import { TableHeader, TableRow } from "./TablePrimitive";
import { type TanstackTable } from "./TableTypes";

interface TableHeaderSectionProps {
  table: TanstackTable<any>;
  sorting?: boolean;
  stickyHeader?: boolean;
}

export function TableHeaderSection({
  table,
  sorting,
  stickyHeader,
}: TableHeaderSectionProps) {
  return (
    <TableHeader className={cn(stickyHeader && "sticky top-0 z-10")}>
      {table.getHeaderGroups().map(headerGroup => (
        <TableRow key={headerGroup.id} className="hover:bg-transparent">
          {headerGroup.headers.map(header => (
            <TableHeadCell key={header.id} header={header} sorting={sorting} />
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
}
