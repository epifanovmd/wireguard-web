import {
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import * as React from "react";

interface UseTableStateOptions {
  sortingState?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
}

export interface TableState {
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
}

export const useTableState = ({
  sortingState,
  onSortingChange,
  rowSelection,
  onRowSelectionChange,
}: UseTableStateOptions): TableState => {
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([]);
  const [internalRowSelection, setInternalRowSelection] = React.useState<RowSelectionState>({});

  return {
    sorting: sortingState ?? internalSorting,
    onSortingChange: onSortingChange ?? setInternalSorting,
    rowSelection: rowSelection ?? internalRowSelection,
    onRowSelectionChange: onRowSelectionChange ?? setInternalRowSelection,
  };
};
