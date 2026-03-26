import { PeerModel } from "@models";
import { formatter } from "@utils";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { usePeerLive } from "../../../hooks/usePeerLive";

export const PeerHandshake: FC<{ row: PeerModel }> = observer(({ row }) => {
  const { active, stats } = usePeerLive(row.data.id);

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
});
