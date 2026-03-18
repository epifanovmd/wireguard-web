import { FC } from "react";

import { PeerModel } from "~@models";

import { useWgPeer } from "../../../socket";
import { Badge } from "../../ui2";
import { PeerStatusBadge } from "./PeerStatusBadge";

export const PeerStatusCell: FC<{ peer: PeerModel }> = ({ peer }) => {
  const { status: liveStatus } = useWgPeer(peer.data.id);
  return (
    <div>
      <div className="flex items-center gap-1.5 flex-wrap">
        <PeerStatusBadge enabled={peer.enabled} isExpired={peer.isExpired} />
        {liveStatus?.isActive && (
          <Badge variant="success" dot>
            Online
          </Badge>
        )}
      </div>
      {liveStatus?.endpoint && (
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
          {liveStatus.endpoint}
        </p>
      )}
    </div>
  );
};
