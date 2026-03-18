import { EWgServerStatus } from "~@api/api-gen/data-contracts";

export interface WgServerStatusPayload {
  serverId: string;
  status: EWgServerStatus;
  timestamp: string;
}

export interface WgServerStatsPayload {
  serverId: string;
  interface: string;
  totalRxBytes: number;
  totalTxBytes: number;
  rxSpeedBps: number;
  txSpeedBps: number;
  peerCount: number;
  activePeerCount: number;
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
  publicKey: string;
  isActive: boolean;
  lastHandshake: string | null;
  endpoint: string | null;
  timestamp: string;
}

export interface WgPeerStatsPayload {
  peerId: string;
  serverId: string;
  rxBytes: number;
  txBytes: number;
  rxSpeedBps: number;
  txSpeedBps: number;
  lastHandshake: string | null;
  isActive: boolean;
  timestamp: string;
}

export interface WgOverviewStatsPayload {
  totalServers: number;
  activeServers: number;
  totalPeers: number;
  activePeers: number;
  totalRxBytes: number;
  totalTxBytes: number;
  rxSpeedBps: number;
  txSpeedBps: number;
  timestamp: string;
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
