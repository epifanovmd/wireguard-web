import {
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import * as React from "react";

interface UseTableStateOptions {
  sortingState?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  paginationState?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  pageSize?: number;
}

export interface TableState {
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
}

export function useTableState({
  sortingState,
  onSortingChange,
  rowSelection,
  onRowSelectionChange,
  paginationState,
  onPaginationChange,
  pageSize = 10,
}: UseTableStateOptions): TableState {
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([]);
  const [internalRowSelection, setInternalRowSelection] = React.useState<RowSelectionState>({});
  const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  return {
    sorting: sortingState ?? internalSorting,
    onSortingChange: onSortingChange ?? setInternalSorting,
    rowSelection: rowSelection ?? internalRowSelection,
    onRowSelectionChange: onRowSelectionChange ?? setInternalRowSelection,
    pagination: paginationState ?? internalPagination,
    onPaginationChange: onPaginationChange ?? setInternalPagination,
  };
}
