import * as React from "react";

import { Pagination } from "../pagination";
import { type TanstackTable } from "./TableTypes";

interface TablePaginationBarProps<TData> {
  table: TanstackTable<TData>;
  currentPage: number;
  totalPages: number;
  selection?: boolean;
}

export const TablePaginationBar = <TData,>({
  table,
  currentPage,
  totalPages,
  selection,
}: TablePaginationBarProps<TData>) => {
  return (
    <div className="flex items-center justify-between px-1">
      <p className="text-xs text-muted-foreground">
        {selection && (
          <>
            {table.getFilteredSelectedRowModel().rows.length} из{" "}
            {table.getFilteredRowModel().rows.length} выбрано ·{" "}
          </>
        )}
        Страница {currentPage} из {totalPages}
      </p>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={page => table.setPageIndex(page - 1)}
        size="sm"
      />
    </div>
  );
}
