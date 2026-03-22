import { User, UserPlus, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { WgPeerDto } from "~@api/api-gen/data-contracts";
import { formatter } from "~@common";
import { PeerStatus } from "~@components/shared";
import { Badge, cn } from "~@components/ui";
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

        {peer.userId ? (
          <Badge
            variant="purple"
            className={cn("gap-1 select-none", {
              "cursor-pointer": canManage,
            })}
            onClick={canManage ? onAssign : undefined}
          >
            <User size={10} className="flex-shrink-0" />
            <span>{userModel?.displayName ?? peer.userId}</span>
            {canManage && (
              <button
                className={cn(
                  "cursor-pointer ml-0.5 rounded-full opacity-60 hover:opacity-100 transition-opacity",
                  "flex items-center justify-center",
                )}
                onClick={e => {
                  e.stopPropagation();
                  onRevoke?.();
                }}
              >
                <X size={10} />
              </button>
            )}
          </Badge>
        ) : (
          <button
            className="cursor-pointer inline-flex items-center gap-1 text-xs text-muted-foreground/70 hover:text-primary transition-colors"
            onClick={onAssign}
          >
            <UserPlus size={11} />
            Назначить
          </button>
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
