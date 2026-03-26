import { noop } from "@common";

import {
  WgOverviewStatsPayload,
  WgPeerActivePayload,
  WgPeerStatsPayload,
  WgPeerStatusPayload,
  WgServerStatsPayload,
  WgServerStatusPayload,
} from "../events";
import { ISocketTransport } from "../transport";
import { IWgSocketService } from "./wgSocket.types";

@IWgSocketService({ inSingleton: true })
export class WgSocketService implements IWgSocketService {
  constructor(@ISocketTransport() private _transport: ISocketTransport) {}

  subscribeOverview(handlers: {
    onStats: (data: WgOverviewStatsPayload) => void;
  }): () => void {
    this._transport.emit("wg:subscribe:overview");

    const unsubStats = this._transport.on(
      "wg:stats:overview",
      handlers.onStats,
    );

    const unsubConnect = this._transport.onConnect(() => {
      this._transport.emit("wg:subscribe:overview");
    });

    return () => {
      this.unsubscribeOverview();
      unsubStats();
      unsubConnect();
    };
  }

  unsubscribeOverview() {
    this._transport.emit("wg:unsubscribe:overview");
  }

  subscribeServer(
    serverId: string,
    handlers: {
      onStats?: (data: WgServerStatsPayload) => void;
      onStatus?: (data: WgServerStatusPayload) => void;
    },
  ): () => void {
    this._transport.emit("wg:subscribe:server", serverId);

    const unsubStats = handlers.onStats
      ? this._transport.on("wg:server:stats", data => {
          if (data.serverId === serverId) handlers.onStats!(data);
        })
      : noop;

    const unsubStatus = handlers.onStatus
      ? this._transport.on("wg:server:status", data => {
          if (data.serverId === serverId) handlers.onStatus!(data);
        })
      : noop;

    const unsubConnect = this._transport.onConnect(() => {
      this._transport.emit("wg:subscribe:server", serverId);
    });

    return () => {
      this.unsubscribeServer(serverId);
      unsubStats();
      unsubStatus();
      unsubConnect();
    };
  }

  unsubscribeServer(serverId: string) {
    this._transport.emit("wg:unsubscribe:server", serverId);
  }

  subscribePeer(
    peerId: string,
    handlers: {
      onStats?: (data: WgPeerStatsPayload) => void;
      onStatus?: (data: WgPeerStatusPayload) => void;
      onActive?: (data: WgPeerActivePayload) => void;
    },
  ): () => void {
    this._transport.emit("wg:subscribe:peer", peerId);

    const unsubStats = handlers.onStats
      ? this._transport.on("wg:peer:stats", data => {
          if (data.peerId === peerId) handlers.onStats!(data);
        })
      : noop;

    const unsubStatus = handlers.onStatus
      ? this._transport.on("wg:peer:status", data => {
          if (data.peerId === peerId) handlers.onStatus!(data);
        })
      : noop;

    const unsubActive = handlers.onActive
      ? this._transport.on("wg:peer:active", data => {
          if (data.peerId === peerId) handlers.onActive!(data);
        })
      : noop;

    const unsubConnect = this._transport.onConnect(() => {
      this._transport.emit("wg:subscribe:peer", peerId);
    });

    return () => {
      this.unsubscribePeer(peerId);
      unsubStats();
      unsubStatus();
      unsubActive();
      unsubConnect();
    };
  }

  unsubscribePeer(peerId: string) {
    this._transport.emit("wg:unsubscribe:peer", peerId);
  }
}
