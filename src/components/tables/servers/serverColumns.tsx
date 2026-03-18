import { ColumnDef } from "@tanstack/react-table";

import { ServerModel } from "~@models";

import { ServerStatusCell } from "../../shared";

export const serverColumns: ColumnDef<ServerModel>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--muted-foreground)]">
        <span className="font-mono">{row.original.name}</span>
        {row.original.data.endpoint && (
          <>
            <span>·</span>
            <span>{row.original.data.endpoint}</span>
          </>
        )}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ServerStatusCell row={row.original} />,
  },
  {
    accessorKey: "interface",
    header: "Interface",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-[var(--muted-foreground)]">
        {row.original.data.interface}
      </span>
    ),
  },
  {
    accessorKey: "listenPort",
    header: "Port",
    cell: ({ row }) => (
      <span className="text-[var(--muted-foreground)]">
        {row.original.data.listenPort}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-xs text-[var(--muted-foreground)]">
        {row.original.createdAtFormatted}
      </span>
    ),
  },
];
