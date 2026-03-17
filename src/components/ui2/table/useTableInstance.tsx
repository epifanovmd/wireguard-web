import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { Checkbox } from "../checkbox";
import { type TableProps } from "./Table";
import { type TableInstanceResult } from "./TableTypes";
import { useTableState } from "./useTableState";

export function useTableInstance<TData>(
  props: TableProps<TData>,
): TableInstanceResult<TData> {
  const {
    data,
    columns,
    size,
    getRowId,
    sorting,
    sortingState,
    onSortingChange,
    manualSorting,
    globalFilter,
    onGlobalFilterChange,
    selection,
    rowSelection,
    onRowSelectionChange,
    onSelectedRowsChange,
    pagination,
    pageSize,
    paginationState,
    onPaginationChange,
    manualPagination,
    pageCount,
  } = props;

  const state = useTableState({
    sortingState,
    onSortingChange,
    rowSelection,
    onRowSelectionChange,
    paginationState,
    onPaginationChange,
    pageSize,
  });

  const checkboxSize = size === "lg" ? "md" : "sm";

  const selectionColumn = React.useMemo<ColumnDef<TData, any>>(
    () => ({
      id: "__selection__",
      header: ({ table }) => (
        <Checkbox
          size={checkboxSize}
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onCheckedChange={v => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          size={checkboxSize}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={v => row.toggleSelected(!!v)}
          aria-label="Select row"
          onClick={e => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableGlobalFilter: false,
    }),
    [checkboxSize],
  );

  const effectiveColumns = React.useMemo(
    () => (selection ? [selectionColumn, ...columns] : columns),
    [selection, selectionColumn, columns],
  );

  const table = useReactTable<TData>({
    data,
    columns: effectiveColumns,
    getRowId,
    state: {
      ...(sorting && { sorting: state.sorting }),
      ...(globalFilter !== undefined && { globalFilter }),
      ...(selection && { rowSelection: state.rowSelection }),
      ...(pagination && { pagination: state.pagination }),
    },
    enableRowSelection: selection,
    onRowSelectionChange: selection ? state.onRowSelectionChange : undefined,
    onSortingChange: sorting ? state.onSortingChange : undefined,
    onGlobalFilterChange,
    onPaginationChange: pagination ? state.onPaginationChange : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: sorting ? getSortedRowModel() : undefined,
    getFilteredRowModel:
      globalFilter !== undefined ? getFilteredRowModel() : undefined,
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    manualSorting,
    manualPagination,
    pageCount: manualPagination ? pageCount : undefined,
  });

  React.useEffect(() => {
    if (!onSelectedRowsChange || !selection) return;
    onSelectedRowsChange(table.getSelectedRowModel().rows.map(r => r.original));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.rowSelection]);

  const rows = table.getRowModel().rows;
  const totalColumns = table.getVisibleLeafColumns().length;
  const currentPage = state.pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const hasFooter = table
    .getFooterGroups()
    .some(fg => fg.headers.some(h => h.column.columnDef.footer));

  return { table, rows, totalColumns, currentPage, totalPages, hasFooter };
}
