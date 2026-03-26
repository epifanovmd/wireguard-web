import { iocHook } from "@di";
import { useEffect, useState } from "react";

import type {
  WgPeerActivePayload,
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
  active: WgPeerActivePayload | null;
}

export function useWgPeer(peerId: string | null | undefined): WgPeerState {
  const service = useWgSocket();
  const [state, setState] = useState<WgPeerState>({
    stats: null,
    status: null,
    active: null,
  });

  useEffect(() => {
    if (!peerId) return;

    return service.subscribePeer(peerId, {
      onStats: stats => setState(s => ({ ...s, stats })),
      onStatus: status => setState(s => ({ ...s, status })),
      onActive: active => setState(s => ({ ...s, active })),
    });
  }, [service, peerId]);

  return state;
}
