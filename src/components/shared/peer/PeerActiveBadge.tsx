import { observer } from "mobx-react-lite";
import { FC } from "react";

import { PeerModel } from "~@models";

import { usePeerLive } from "../../../hooks/usePeerLive";
import { Badge } from "../../ui";

export const PeerActiveBadge: FC<{ row: PeerModel }> = observer(({ row }) => {
  const { active, stats } = usePeerLive(row.data.id);

  const isActive = active?.isActive ?? stats?.isActive ?? row.isActive;

  if (isActive) {
    return (
      <Badge variant="success" dot>
        Активен
      </Badge>
    );
  }

  return <span className="text-xs text-muted-foreground">Нет активности</span>;
});
