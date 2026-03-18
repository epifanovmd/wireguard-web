import { FC } from "react";

import { ServerModel } from "~@models";

import { useWgServer } from "../../../socket";

export const ServerPeersCell: FC<{ server: ServerModel }> = ({ server }) => {
  const { status: liveStatus } = useWgServer(server.data.id);

  if (!liveStatus) {
    return <span className="text-[var(--muted-foreground)]">—</span>;
  }

  return (
    <span className="text-xs text-[var(--muted-foreground)]">
      {liveStatus.activePeerCount}/{liveStatus.peerCount} active
    </span>
  );
};
