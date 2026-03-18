import { ColumnDef } from "@tanstack/react-table";

import { PeerModel } from "~@models";

import { PeerHandshakeCell, PeerStatusCell } from "../../shared";
import { Badge, CopyableText } from "../../ui2";

export const peerColumns: ColumnDef<PeerModel>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-[var(--foreground)]">
          {row.original.name}
        </p>
        <CopyableText
          text={row.original.data.publicKey}
          displayText={row.original.shortPublicKey}
          className="mt-0.5 text-[var(--muted-foreground)]"
        />
      </div>
    ),
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
    cell: ({ row }) => <PeerStatusCell row={row.original} />,
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
    cell: ({ row }) => <PeerHandshakeCell row={row.original} />,
  },
];
