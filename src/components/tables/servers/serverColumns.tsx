import { ColumnDef } from "@tanstack/react-table";

import { ServerModel } from "~@models";

import {
  ServerNameLiveCell,
  ServerPeersCell,
} from "../../shared";

export const serverColumns: ColumnDef<ServerModel>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <ServerNameLiveCell server={row.original} />,
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
        :{row.original.data.listenPort}
      </span>
    ),
  },
  {
    id: "peers",
    header: "Peers",
    cell: ({ row }) => <ServerPeersCell server={row.original} />,
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
