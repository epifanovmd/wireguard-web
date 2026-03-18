import { ColumnDef } from "@tanstack/react-table";

import { PeerModel } from "~@models";

import { PeerHandshakeCell, PeerStatusCell } from "../../shared";
import { Badge, CopyableText } from "../../ui2";

export const peerColumns: ColumnDef<PeerModel>[] = [
  {
    accessorKey: "name",
    header: "Название",
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
    header: "IP-адрес",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-[var(--muted-foreground)]">
        {row.original.data.allowedIPs}
      </span>
    ),
  },
  {
    id: "status",
    header: "Статус",
    cell: ({ row }) => <PeerStatusCell row={row.original} />,
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
        <span className="text-xs text-[var(--muted-foreground)]">Нет</span>
      ),
  },
  {
    accessorKey: "expiresAt",
    header: "Истекает",
    cell: ({ row }) => (
      <span className="text-xs text-[var(--muted-foreground)]">
        {row.original.expiresAt ?? "Никогда"}
      </span>
    ),
  },
  {
    id: "handshake",
    header: "Последнее рукопожатие",
    cell: ({ row }) => <PeerHandshakeCell row={row.original} />,
  },
];
