import { iocHook } from "@force-dev/react";
import { useEffect, useState } from "react";

import type {
  WgPeerStatsPayload,
  WgPeerStatusPayload,
  WgServerStatsPayload,
  WgServerStatusPayload,
} from "../events";
import { IWgSocketService } from "./wgSocket.types";

export const useWgSocket = iocHook(IWgSocketService);

// ─── useWgServer ──────────────────────────────────────────────────────────────

export interface WgServerState {
  stats: WgServerStatsPayload | null;
  status: WgServerStatusPayload | null;
}

export function useWgServer(
  serverId: string | null | undefined,
): WgServerState {
  const service = useWgSocket();
  const [state, setState] = useState<WgServerState>({
    stats: null,
    status: null,
  });

  useEffect(() => {
    if (!serverId) return;

    return service.subscribeServer(serverId, {
      onStats: stats => setState(s => ({ ...s, stats })),
      onStatus: status => setState(s => ({ ...s, status })),
    });
  }, [service, serverId]);

  return state;
}

// ─── useWgPeer ────────────────────────────────────────────────────────────────

export interface WgPeerState {
  stats: WgPeerStatsPayload | null;
  status: WgPeerStatusPayload | null;
}

export function useWgPeer(peerId: string | null | undefined): WgPeerState {
  const service = useWgSocket();
  const [state, setState] = useState<WgPeerState>({
    stats: null,
    status: null,
  });

  useEffect(() => {
    if (!peerId) return;

    return service.subscribePeer(peerId, {
      onStats: stats => setState(s => ({ ...s, stats })),
      onStatus: status => setState(s => ({ ...s, status })),
    });
  }, [service, peerId]);

  return state;
}
