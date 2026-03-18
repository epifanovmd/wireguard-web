import { format, parseISO } from "date-fns";
import { FC } from "react";

import { PeerModel } from "~@models";

import { useWgPeer } from "../../../socket";

export const PeerHandshakeCell: FC<{ row: PeerModel }> = ({ row }) => {
  const { status: liveStatus } = useWgPeer(row.data.id);

  return (
    <span className="text-xs text-[var(--muted-foreground)]">
      {liveStatus?.lastHandshake
        ? format(parseISO(liveStatus.lastHandshake), "dd.MM.yyyy HH:mm:ss")
        : row.createdAt}
    </span>
  );
};
