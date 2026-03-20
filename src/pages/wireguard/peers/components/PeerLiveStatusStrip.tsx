import { observer } from "mobx-react-lite";
import { FC } from "react";

import { WgPeerDto } from "~@api/api-gen/data-contracts";
import { formatter } from "~@common";
import { PeerStatus } from "~@components/shared";
import { Badge } from "~@components/ui";
import { usePeerStatsStore } from "~@store/peerStats";

interface PeerLiveStatusStripProps {
  peer: WgPeerDto;
}

export const PeerLiveStatusStrip: FC<PeerLiveStatusStripProps> = observer(
  ({ peer }) => {
    const store = usePeerStatsStore();
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
        {peer.userId && (
          <Badge variant="purple" dot>
            Назначен
          </Badge>
        )}
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
