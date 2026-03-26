import { ServerModel } from "@models";
import { ColumnDef } from "@tanstack/react-table";

import { ServerPeerCountLive, ServerStatusLive } from "../../shared/server";

export const serverColumns: ColumnDef<ServerModel>[] = [
  {
    accessorKey: "name",
    header: "Название",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-foreground">{row.original.name}</p>
        {row.original.data.endpoint && (
          <span className="text-xs text-muted-foreground">
            {row.original.data.endpoint}
          </span>
        )}
      </div>
    ),
  },
  {
    id: "status",
    header: "Статус",
    cell: ({ row }) => <ServerStatusLive row={row.original} />,
  },
  {
    accessorKey: "address",
    header: "Адрес",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.data.address}
      </span>
    ),
  },
  {
    id: "interface",
    header: "Интерфейс",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.data.interface}
        <span className="text-muted-foreground/50"> : </span>
        {row.original.data.listenPort}
      </span>
    ),
  },
  {
    id: "peers",
    header: "Пиры",
    cell: ({ row }) => <ServerPeerCountLive row={row.original} />,
  },
  {
    id: "description",
    header: "Описание",
    cell: ({ row }) =>
      row.original.data.description ? (
        <span className="text-xs text-foreground">
          {row.original.data.description}
        </span>
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "createdAt",
    header: "Создан",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.createdAtDate.formattedDate}
      </span>
    ),
  },
];
