import { format } from "date-fns";
import { FC } from "react";

import { PeerModel } from "~@models";

import { useWgPeer } from "../../../socket";

export const PeerHandshakeCell: FC<{ peer: PeerModel }> = ({ peer }) => {
  const { status: liveStatus } = useWgPeer(peer.data.id);
  return (
    <span className="text-xs text-[var(--muted-foreground)]">
      {liveStatus?.lastHandshake
        ? format(liveStatus.lastHandshake, "DD.MM.YYYY HH:mm:ss")
        : peer.createdAtFormatted}
    </span>
  );
};
