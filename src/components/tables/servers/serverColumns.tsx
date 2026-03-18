import { ColumnDef } from "@tanstack/react-table";

import { ServerModel } from "~@models";

import { ServerStatusLive } from "../../shared/server/ServerStatusLive";

export const serverColumns: ColumnDef<ServerModel>[] = [
  {
    accessorKey: "name",
    header: "Название",
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
    header: "Статус",
    cell: ({ row }) => <ServerStatusLive row={row.original} />,
  },
  {
    accessorKey: "interface",
    header: "Интерфейс",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-[var(--muted-foreground)]">
        {row.original.data.interface}
      </span>
    ),
  },
  {
    accessorKey: "listenPort",
    header: "Порт",
    cell: ({ row }) => (
      <span className="text-[var(--muted-foreground)]">
        {row.original.data.listenPort}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Создан",
    cell: ({ row }) => (
      <span className="text-xs text-[var(--muted-foreground)]">
        {row.original.createdAt}
      </span>
    ),
  },
];
