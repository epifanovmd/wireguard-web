import {
  EWgServerStatus,
  WgOverviewStatsPayload,
  WgPeerStatsPayload,
  WgServerStatsPayload,
} from "~@api/api-gen/data-contracts";

export type { WgOverviewStatsPayload, WgPeerStatsPayload, WgServerStatsPayload };

export interface WgServerStatusPayload {
  serverId: string;
  status: EWgServerStatus;
  timestamp: string;
}

export interface WgPeerStatusPayload {
  peerId: string;
  serverId: string;
  status: EWgServerStatus;
  timestamp: string;
}

export interface WgPeerActivePayload {
  peerId: string;
  serverId: string;
  isActive: boolean;
  lastHandshake: string | null;
}

// ─── Socket event maps ────────────────────────────────────────────────────────

/** Server → Client WireGuard events */
export interface WgSocketServerEvents {
  "wg:server:status": (data: WgServerStatusPayload) => void;
  "wg:server:stats": (data: WgServerStatsPayload) => void;
  "wg:peer:status": (data: WgPeerStatusPayload) => void;
  "wg:peer:active": (data: WgPeerActivePayload) => void;
  "wg:peer:stats": (data: WgPeerStatsPayload) => void;
  "wg:stats:overview": (data: WgOverviewStatsPayload) => void;
  authenticated: (data: { userId: string }) => void;
  auth_error: (data: { message: string }) => void;
}

/** Client → Server WireGuard events */
export interface WgSocketClientEvents {
  "wg:subscribe:overview": () => void;
  "wg:unsubscribe:overview": () => void;
  "wg:subscribe:server": (serverId: string) => void;
  "wg:unsubscribe:server": (serverId: string) => void;
  "wg:subscribe:peer": (peerId: string) => void;
  "wg:unsubscribe:peer": (peerId: string) => void;
}
