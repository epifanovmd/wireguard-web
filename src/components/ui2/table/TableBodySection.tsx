import { type Row } from "@tanstack/react-table";
import * as React from "react";

import { Empty } from "../empty";
import { Spinner } from "../spinner";
import { TableDataRow } from "./TableDataRow";
import { TableBody } from "./TablePrimitive";

interface TableBodySectionProps {
  rows: Row<any>[];
  totalColumns: number;
  loading?: boolean;
  empty?: React.ReactNode;
  onRowClick?: (row: any, e: React.MouseEvent<HTMLTableRowElement>) => void;
}

export function TableBodySection({
  rows,
  totalColumns,
  loading,
  empty,
  onRowClick,
}: TableBodySectionProps) {
  if (loading) {
    return (
      <TableBody>
        <tr>
          <td colSpan={totalColumns} className="h-24">
            <div className="flex items-center justify-center">
              <Spinner size="md" variant="muted" />
            </div>
          </td>
        </tr>
      </TableBody>
    );
  }

  if (rows.length === 0) {
    return (
      <TableBody>
        <tr>
          <td colSpan={totalColumns}>
            {empty ?? <Empty size="sm" title="No data" icon="inbox" />}
          </td>
        </tr>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {rows.map(row => (
        <TableDataRow key={row.id} row={row} onRowClick={onRowClick} />
      ))}
    </TableBody>
  );
}
