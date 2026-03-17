import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import * as React from "react";

import { Checkbox } from "../checkbox";
import { cn } from "../cn";
import { Empty } from "../empty";
import { Pagination } from "../pagination";
import { Spinner } from "../spinner";
import { TableContext } from "./TableContext";
import {
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "./TablePrimitive";

export type { ColumnDef };

export interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];

  // Appearance
  variant?: "default" | "striped" | "bordered";
  size?: "sm" | "md" | "lg";
  caption?: React.ReactNode;
  stickyHeader?: boolean;
  className?: string;
  containerClassName?: string;

  // Sorting
  sorting?: boolean;
  sortingState?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  manualSorting?: boolean;

  // Global filter
  globalFilter?: string;
  onGlobalFilterChange?: OnChangeFn<string>;

  // Row selection
  selection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  onSelectedRowsChange?: (rows: TData[]) => void;

  // Pagination
  pagination?: boolean;
  pageSize?: number;
  paginationState?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  manualPagination?: boolean;
  pageCount?: number;

  // State
  loading?: boolean;
  empty?: React.ReactNode;

  // Row
  onRowClick?: (row: TData, event: React.MouseEvent<HTMLTableRowElement>) => void;
  getRowId?: (originalRow: TData, index: number) => string;
}

function TableComponent<TData>({
  data,
  columns,
  variant = "default",
  size = "md",
  caption,
  stickyHeader,
  className,
  containerClassName,
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
  pageSize = 10,
  paginationState,
  onPaginationChange,
  manualPagination,
  pageCount,
  loading,
  empty,
  onRowClick,
  getRowId,
}: TableProps<TData>) {
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([]);
  const [internalRowSelection, setInternalRowSelection] = React.useState<RowSelectionState>({});
  const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const effectiveSorting = sortingState ?? internalSorting;
  const effectiveSortingChange: OnChangeFn<SortingState> = onSortingChange ?? setInternalSorting;

  const effectiveRowSelection = rowSelection ?? internalRowSelection;
  const effectiveRowSelectionChange: OnChangeFn<RowSelectionState> =
    onRowSelectionChange ?? setInternalRowSelection;

  const effectivePagination = paginationState ?? internalPagination;
  const effectivePaginationChange: OnChangeFn<PaginationState> =
    onPaginationChange ?? setInternalPagination;

  const selectionColumn: ColumnDef<TData, any> = {
    id: "__selection__",
    header: ({ table }) => (
      <Checkbox
        size={size === "lg" ? "md" : "sm"}
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        onCheckedChange={v => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        size={size === "lg" ? "md" : "sm"}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={v => row.toggleSelected(!!v)}
        aria-label="Select row"
        onClick={e => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableGlobalFilter: false,
  };

  const effectiveColumns = selection ? [selectionColumn, ...columns] : columns;

  const table = useReactTable({
    data,
    columns: effectiveColumns,
    getRowId,
    state: {
      ...(sorting && { sorting: effectiveSorting }),
      ...(globalFilter !== undefined && { globalFilter }),
      ...(selection && { rowSelection: effectiveRowSelection }),
      ...(pagination && { pagination: effectivePagination }),
    },
    enableRowSelection: selection,
    onRowSelectionChange: selection ? effectiveRowSelectionChange : undefined,
    onSortingChange: sorting ? effectiveSortingChange : undefined,
    onGlobalFilterChange,
    onPaginationChange: pagination ? effectivePaginationChange : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: sorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: globalFilter !== undefined ? getFilteredRowModel() : undefined,
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    manualSorting,
    manualPagination,
    pageCount: manualPagination ? pageCount : undefined,
  });

  React.useEffect(() => {
    if (onSelectedRowsChange && selection) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map(row => row.original);

      onSelectedRowsChange(selectedRows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveRowSelection]);

  const rows = table.getRowModel().rows;
  const totalColumns = table.getAllColumns().length;
  const currentPage = effectivePagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  return (
    <TableContext.Provider value={{ size, variant }}>
      <div className={cn("w-full space-y-2", containerClassName)}>
        <div className="relative overflow-auto rounded-lg border">
          <TableRoot className={className}>
            {caption && <TableCaption>{caption}</TableCaption>}
            <TableHeader className={cn(stickyHeader && "sticky top-0 z-10")}>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map(header => {
                    const canSort = sorting && header.column.getCanSort();

                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : canSort ? (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {header.column.getIsSorted() === "asc" ? (
                              <ArrowUp className="h-3.5 w-3.5 shrink-0" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ArrowDown className="h-3.5 w-3.5 shrink-0" />
                            ) : (
                              <ArrowUpDown className="h-3.5 w-3.5 shrink-0 opacity-40" />
                            )}
                          </button>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {loading && (
                <tr>
                  <td colSpan={totalColumns} className="h-24">
                    <div className="flex items-center justify-center">
                      <Spinner size="md" variant="muted" />
                    </div>
                  </td>
                </tr>
              )}

              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={totalColumns}>
                    {empty ?? (
                      <Empty size="sm" title="No data" icon="inbox" />
                    )}
                  </td>
                </tr>
              )}

              {!loading &&
                rows.map(row => (
                  <TableRow
                    key={row.id}
                    selected={row.getIsSelected()}
                    onClick={onRowClick ? e => onRowClick(row.original, e) : undefined}
                    className={cn(onRowClick && "cursor-pointer")}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>

            {table.getFooterGroups().some(fg =>
              fg.headers.some(h => h.column.columnDef.footer),
            ) && (
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
            )}
          </TableRoot>
        </div>

        {pagination && totalPages > 1 && (
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
              onPageChange={page =>
                table.setPageIndex(page - 1)
              }
              size="sm"
            />
          </div>
        )}
      </div>
    </TableContext.Provider>
  );
}

TableComponent.displayName = "Table";

export const Table = Object.assign(TableComponent, {
  Root: TableRoot,
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Caption: TableCaption,
});
