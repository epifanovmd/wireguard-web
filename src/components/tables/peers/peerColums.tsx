import { ColumnDef } from "@tanstack/react-table";

import { PeerModel } from "~@models";

import {
  PeerHandshakeCell,
  PeerNameCell,
  PeerStatusCell,
} from "../../shared";
import { Badge } from "../../ui2";

export const peerColumns: ColumnDef<PeerModel>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <PeerNameCell peer={row.original} />,
  },
  {
    accessorKey: "allowedIPs",
    header: "IP",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-[var(--muted-foreground)]">
        {row.original.data.allowedIPs}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => <PeerStatusCell peer={row.original} />,
  },
  {
    id: "psk",
    header: "PSK",
    cell: ({ row }) =>
      row.original.data.hasPresharedKey ? (
        <Badge variant="info" dot>
          Yes
        </Badge>
      ) : (
        <span className="text-xs text-[var(--muted-foreground)]">No</span>
      ),
  },
  {
    accessorKey: "expiresAt",
    header: "Expires",
    cell: ({ row }) => (
      <span className="text-xs text-[var(--muted-foreground)]">
        {row.original.expiresAtFormatted ?? "Never"}
      </span>
    ),
  },
  {
    id: "handshake",
    header: "Last handshake",
    cell: ({ row }) => <PeerHandshakeCell peer={row.original} />,
  },
];
