import { FC } from "react";

import { PeerModel } from "~@models";

import { useWgPeer } from "../../../socket";
import { Badge } from "../../ui2";
import { PeerStatusBadge } from "./PeerStatusBadge";

export const PeerStatusCell: FC<{ row: PeerModel }> = ({ row }) => {
  const { status: liveStatus } = useWgPeer(row.data.id);

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <PeerStatusBadge enabled={row.enabled} isExpired={row.isExpired} />
      {liveStatus?.isActive && (
        <Badge variant="success" dot>
          Online
        </Badge>
      )}
    </div>
  );
};
