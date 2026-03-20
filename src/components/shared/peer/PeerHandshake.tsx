import { FC } from "react";

import { formatter } from "~@common";
import { PeerModel } from "~@models";

import { useWgPeer } from "../../../socket";

export const PeerHandshake: FC<{ row: PeerModel }> = ({ row }) => {
  const { active, stats } = useWgPeer(row.data.id);

  const lastHandshake =
    active?.lastHandshake ?? stats?.lastHandshake ?? row.data.lastHandshake;

  return (
    <span
      className="text-xs text-muted-foreground"
      title={formatter.date.format(lastHandshake) || undefined}
    >
      {formatter.date.formatDiff(lastHandshake) || "–"}
    </span>
  );
};
