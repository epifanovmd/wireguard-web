import { FC } from "react";

import { ServerModel } from "~@models";

import { type ColumnDef, Table } from "../../ui2";

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
  pageSize = 20,
  onRowClick,
}) => (
  <Table
    data={data}
    columns={columns}
    loading={loading}
    pagination
    pageSize={pageSize}
    getRowId={s => s.data.id}
    onRowClick={onRowClick}
    empty={
      <div className="text-center py-8 text-[var(--muted-foreground)] text-sm">
        No servers configured
      </div>
    }
  />
);
