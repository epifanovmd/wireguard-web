import { ColumnDef } from "@tanstack/react-table";

import { PeerModel } from "~@models";

import { PeerActiveBadge, PeerHandshake, PeerStatusLive } from "../../shared";
import { Badge, CopyableText } from "../../ui";

export const peerColumns: ColumnDef<PeerModel>[] = [
  {
    accessorKey: "name",
    header: "Название",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-foreground">{row.original.name}</p>
        <CopyableText
          text={row.original.data.publicKey}
          displayText={row.original.shortPublicKey}
          className="mt-0.5 text-muted-foreground"
        />
      </div>
    ),
  },
  {
    accessorKey: "allowedIPs",
    header: "IP-адрес",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.data.allowedIPs}
      </span>
    ),
  },
  {
    id: "status",
    header: "Статус",
    cell: ({ row }) => <PeerStatusLive row={row.original} />,
  },
  {
    id: "isActive",
    header: "Активность",
    cell: ({ row }) => <PeerActiveBadge row={row.original} />,
  },
  {
    id: "lastHandshake",
    header: "Рукопожатие",
    cell: ({ row }) => <PeerHandshake row={row.original} />,
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
    id: "psk",
    header: "PSK",
    cell: ({ row }) =>
      row.original.data.hasPresharedKey ? (
        <Badge variant="info" dot>
          Да
        </Badge>
      ) : (
        <span className="text-xs text-muted-foreground">Нет</span>
      ),
  },
  {
    accessorKey: "expiresAt",
    header: "Истекает",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.expiresAtDate.formatted ?? "Никогда"}
      </span>
    ),
  },
];
