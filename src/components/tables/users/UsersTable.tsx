import { FC } from "react";

import { PublicUserModel } from "~@models";

import { type ColumnDef, Empty, Table } from "../../ui";

export interface UsersTableProps {
  data: PublicUserModel[];
  columns: ColumnDef<PublicUserModel>[];
  loading?: boolean;
  onRowClick?: (user: PublicUserModel) => void;
}

export const UsersTable: FC<UsersTableProps> = ({
  data,
  columns,
  loading,
  onRowClick,
}) => (
  <Table
    data={data}
    columns={columns}
    loading={loading}
    getRowId={u => u.data.userId}
    onRowClick={onRowClick}
    empty={<Empty size="sm" icon="search" title="Пользователи не найдены" />}
  />
);
