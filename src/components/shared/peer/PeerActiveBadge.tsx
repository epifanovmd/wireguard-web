import { FC } from "react";

import { PeerModel } from "~@models";

import { useWgPeer } from "../../../socket";
import { Badge } from "../../ui";

export const PeerActiveBadge: FC<{ row: PeerModel }> = ({ row }) => {
  const { active, stats } = useWgPeer(row.data.id);

  const isActive = active?.isActive ?? stats?.isActive ?? row.isActive;

  if (isActive) {
    return (
      <Badge variant="success" dot>
        Активен
      </Badge>
    );
  }

  return <span className="text-xs text-muted-foreground">Нет активности</span>;
};
