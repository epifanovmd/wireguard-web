import { FC } from "react";

import { formatter } from "~@common";
import { PeerModel } from "~@models";

import { useWgPeer } from "../../../socket";

export const PeerHandshake: FC<{ row: PeerModel }> = ({ row }) => {
  const { active } = useWgPeer(row.data.id);

  return (
    <span className="text-xs text-[var(--muted-foreground)]">
      {formatter.date.format(active?.lastHandshake) || "–"}
    </span>
  );
};
