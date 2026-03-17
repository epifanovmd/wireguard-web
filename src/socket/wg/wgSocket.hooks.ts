import { iocHook } from "@force-dev/react";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

import { useApi } from "~@api";
import { IChartPoint } from "~@components/SpeedChart/WGChart";

import type {
  WgOverviewStatsPayload,
  WgPeerStatsPayload,
  WgPeerStatusPayload,
  WgServerStatsPayload,
  WgServerStatusPayload,
} from "../events";
import { IWgSocketService } from "./wgSocket.types";

export const useWgSocket = iocHook(IWgSocketService);

export function useWgOverview() {
  const service = useWgSocket();
  const [points, setPoints] = useState<IChartPoint[]>([]);
  const [stats, setStats] = useState<WgOverviewStatsPayload | null>(null);

  useEffect(() => {
    return service.subscribeOverview({
      onStats: s => {
        setPoints(prev => [
          ...prev.slice(-59),
          {
            t: format(s.timestamp, "HH:mm:ss"),
            rx: s.rxSpeedBps,
            tx: s.txSpeedBps,
          },
        ]);

        setStats(s);
      },
    });
  }, [service]);

  return { stats, points };
}

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

  // Keep latest handlers stable without re-subscribing on every render
  const stateRef = useRef(state);
  stateRef.current = state;

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
