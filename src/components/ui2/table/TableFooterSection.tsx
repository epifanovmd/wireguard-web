import { flexRender } from "@tanstack/react-table";
import * as React from "react";

import { TableFooter, TableHead, TableRow } from "./TablePrimitive";
import { type TanstackTable } from "./TableTypes";

interface TableFooterSectionProps<TData> {
  table: TanstackTable<TData>;
}

export const TableFooterSection = <TData,>({ table }: TableFooterSectionProps<TData>) => {
  return (
    <TableFooter>
      {table.getFooterGroups().map(footerGroup => (
        <TableRow key={footerGroup.id}>
          {footerGroup.headers.map(header => (
            <TableHead key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.footer,
                    header.getContext(),
                  )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableFooter>
  );
}
