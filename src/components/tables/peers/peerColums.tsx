import { PeerModel } from "@models";
import { ColumnDef } from "@tanstack/react-table";

import {
  PeerActiveBadge,
  PeerBytesLive,
  PeerHandshake,
  PeerSpeedLive,
  PeerStatusLive,
} from "../../shared";
import { Badge } from "../../ui";

export const peerColumns: ColumnDef<PeerModel>[] = [
  {
    accessorKey: "name",
    header: "Название",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-foreground">{row.original.name}</p>
        {row.original.data.allowedIPs && (
          <span className="mt-0.5 font-mono text-xs text-muted-foreground">
            {row.original.data.allowedIPs}
          </span>
        )}
      </div>
    ),
  },
  {
    id: "speed",
    header: "Скорость",
    cell: ({ row }) => <PeerSpeedLive row={row.original} />,
  },
  {
    id: "traffic",
    header: "Трафик",
    cell: ({ row }) => <PeerBytesLive row={row.original} />,
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
    id: "status",
    header: "Статус",
    cell: ({ row }) => <PeerStatusLive row={row.original} />,
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
    cell: ({ row }) =>
      row.original.expiresAtDate.formatted ? (
        <span className="text-xs text-foreground">
          {row.original.expiresAtDate.formatted}
        </span>
      ) : (
        <span className="text-xs italic text-muted-foreground">—</span>
      ),
  },
];
