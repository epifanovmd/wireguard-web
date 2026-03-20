import { FC } from "react";

import { ServerModel } from "~@models";

import { useWgServer } from "../../../socket";

export const ServerPeerCountLive: FC<{ row: ServerModel }> = ({ row }) => {
  const { stats } = useWgServer(row.data.id);

  if (!stats) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <span className="text-xs">
      <span className="font-medium text-foreground">{stats.activePeerCount}</span>
      <span className="text-muted-foreground"> / {stats.peerCount}</span>
    </span>
  );
};
