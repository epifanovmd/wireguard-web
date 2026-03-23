import { FC } from "react";

import { ServerModel } from "~@models";

import { type ColumnDef, Empty, Table } from "../../ui";

export interface ServersTableProps {
  data: ServerModel[];
  columns: ColumnDef<ServerModel>[];
  loading?: boolean;
  pageSize?: number;
  onRowClick?: (server: ServerModel) => void;
}

export const ServersTable: FC<ServersTableProps> = ({
  data,
  columns,
  loading,
  onRowClick,
}) => (
  <Table
    data={data}
    columns={columns}
    loading={loading}
    getRowId={s => s.data.id}
    onRowClick={onRowClick}
    empty={<Empty size="sm" icon="database" title="Серверы не настроены" />}
  />
);
