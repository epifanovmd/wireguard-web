import { FC } from "react";

import { PeerModel } from "~@models";

import { type ColumnDef, Table } from "../../ui2";

export interface PeersTableProps {
  data: PeerModel[];
  columns: ColumnDef<PeerModel>[];
  loading?: boolean;
  pageSize?: number;
  onRowClick?: (peer: PeerModel) => void;
}

export const PeersTable: FC<PeersTableProps> = ({
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
    getRowId={p => p.data.id}
    onRowClick={onRowClick}
    empty={
      <div className="text-center py-8 text-[var(--muted-foreground)] text-sm">
        No peers found
      </div>
    }
  />
);
