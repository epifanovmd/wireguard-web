import {
  type ColumnDef,
  type OnChangeFn,
  type Row,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import * as React from "react";
import { PropsWithChildren } from "react";

import { createSlot, useSlotProps } from "~@common/slots";

import { TableBodySection } from "./components/TableBodySection";
import { TableContext } from "./components/TableContext";
import { TableFooterSection } from "./components/TableFooterSection";
import { TableHeaderSection } from "./components/TableHeaderSection";
import { TableCaption, TableRoot } from "./components/TablePrimitive";
import { useTableInstance } from "./hooks/useTableInstance";
import {
  TablePagination,
  TablePaginationProps,
} from "./pagination/TablePagination";

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

  // State
  loading?: boolean;
  refreshing?: boolean;
  empty?: React.ReactNode;

  // Row
  onRowClick?: (
    row: TData,
    event: React.MouseEvent<HTMLTableRowElement>,
  ) => void;
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
}

const Pagination = createSlot<TablePaginationProps>("Pagination");

const TableComponent = <TData,>(
  props: PropsWithChildren<TableProps<TData>>,
) => {
  const {
    variant = "default",
    size = "md",
    caption,
    stickyHeader,
    className,
    containerClassName,
    sorting,
    loading,
    refreshing,
    empty,
    onRowClick,
    children,
  } = props;

  const { table, rows, totalColumns, hasFooter } = useTableInstance(props);
  const { pagination } = useSlotProps(Table, children);

  return (
    <TableContext.Provider value={{ size, variant }}>
      <div className="overflow-auto rounded-lg border">
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
              refreshing={refreshing}
              empty={empty}
              onRowClick={onRowClick}
            />
            {hasFooter && <TableFooterSection table={table} />}
          </TableRoot>
        </div>

        {pagination && <TablePagination {...pagination} />}
      </div>
    </TableContext.Provider>
  );
};

TableComponent.displayName = "Table";

export const Table = Object.assign(TableComponent, {
  Pagination,
});
