import {
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import * as React from "react";

import { cn } from "../cn";
import { TableBodySection } from "./TableBodySection";
import { TableContext } from "./TableContext";
import { TableFooterSection } from "./TableFooterSection";
import { TableHeaderSection } from "./TableHeaderSection";
import { TablePaginationBar } from "./TablePaginationBar";
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
import { useTableInstance } from "./useTableInstance";

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
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
}

const TableComponent = <TData,>(props: TableProps<TData>) => {
  const {
    variant = "default",
    size = "md",
    caption,
    stickyHeader,
    className,
    containerClassName,
    sorting,
    selection,
    pagination,
    loading,
    empty,
    onRowClick,
  } = props;

  const { table, rows, totalColumns, currentPage, totalPages, hasFooter } =
    useTableInstance(props);

  return (
    <TableContext.Provider value={{ size, variant }}>
      <div className={cn("w-full space-y-2", containerClassName)}>

        <div className="overflow-auto rounded-lg border">
          <TableRoot className={className}>
            {caption && <TableCaption>{caption}</TableCaption>}

            <TableHeaderSection
              table={table}
              sorting={sorting}
              stickyHeader={stickyHeader}
            />

            <TableBodySection
              rows={rows}
              totalColumns={totalColumns}
              loading={loading}
              empty={empty}
              onRowClick={onRowClick}
            />

            {hasFooter && <TableFooterSection table={table} />}
          </TableRoot>
        </div>

        {pagination && totalPages > 1 && (
          <TablePaginationBar
            table={table}
            currentPage={currentPage}
            totalPages={totalPages}
            selection={selection}
          />
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
