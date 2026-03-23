import { observer } from "mobx-react-lite";
import { FC } from "react";

import { WgPeerDto } from "~@api/api-gen/data-contracts";
import { formatter } from "~@common";
import { PeerStatus, PeerUserBadge } from "~@components/shared";
import { Badge } from "~@components/ui";
import { PublicUserModel } from "~@models";
import { usePeerStatsStore } from "~@store/peerStats";

interface PeerLiveStatusStripProps {
  peer: WgPeerDto;
  canManage?: boolean;
  onAssign?: () => void;
  onRevoke?: () => void;
}

export const PeerLiveStatusStrip: FC<PeerLiveStatusStripProps> = observer(
  ({ peer, canManage, onAssign, onRevoke }) => {
    const store = usePeerStatsStore();
    const userModel = peer.user ? new PublicUserModel(peer.user) : null;
    const liveStats = store.stats;
    const liveStatus = store.status;
    const liveActive = store.active;

    const lastHandshake =
      liveActive?.lastHandshake ??
      liveStats?.lastHandshake ??
      peer.lastHandshake;

    return (
      <div className="flex items-center gap-3 flex-wrap">
        <PeerStatus
          status={liveStatus?.status ?? peer.status}
          enabled={peer.enabled}
        />
        {(liveActive?.isActive ?? liveStats?.isActive ?? peer.isActive) ? (
          <Badge variant="success" dot>
            Активен
          </Badge>
        ) : (
          <Badge variant="secondary" dot>
            Нет активности
          </Badge>
        )}
        {peer.hasPresharedKey && (
          <Badge variant="info" dot>
            PSK включён
          </Badge>
        )}

        <PeerUserBadge
          displayName={userModel?.displayName ?? (peer.userId ? peer.userId : null)}
          canManage={canManage}
          onAssign={onAssign}
          onRevoke={onRevoke}
        />

        <span
          className="text-xs text-muted-foreground"
          title={formatter.date.format(lastHandshake) || undefined}
        >
          Рукопожатие: {formatter.date.formatDiff(lastHandshake) || "—"}
        </span>
      </div>
    );
  },
);
