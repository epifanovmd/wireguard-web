import { type OnChangeFn, type PaginationState } from "@tanstack/react-table";
import { FC } from "react";

import { PublicUserModel } from "~@models";

import { type ColumnDef, Table } from "../../ui2";

export interface UsersTableProps {
  data: PublicUserModel[];
  columns: ColumnDef<PublicUserModel>[];
  loading?: boolean;
  manualPagination?: boolean;
  paginationState?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  pageCount?: number;
  pageSize?: number;
  onRowClick?: (user: PublicUserModel) => void;
}

export const UsersTable: FC<UsersTableProps> = ({
  data,
  columns,
  loading,
  manualPagination,
  paginationState,
  onPaginationChange,
  pageCount,
  pageSize = 20,
  onRowClick,
}) => (
  <Table
    data={data}
    columns={columns}
    loading={loading}
    pagination
    pageSize={pageSize}
    manualPagination={manualPagination}
    paginationState={paginationState}
    onPaginationChange={onPaginationChange}
    pageCount={pageCount}
    getRowId={u => u.data.userId}
    onRowClick={onRowClick}
    empty={
      <div className="text-center py-8 text-[var(--muted-foreground)] text-sm">
        No users found
      </div>
    }
  />
);
