import { createServiceDecorator } from "~@common/ioc";

import {
  WgOverviewStatsPayload,
  WgPeerActivePayload,
  WgPeerStatsPayload,
  WgPeerStatusPayload,
  WgServerStatsPayload,
  WgServerStatusPayload,
} from "../events";

export const IWgSocketService = createServiceDecorator<IWgSocketService>();

export interface IWgSocketService {
  subscribeOverview(handlers: {
    onStats: (data: WgOverviewStatsPayload) => void;
  }): () => void;
  unsubscribeOverview(): void;
  subscribeServer(
    serverId: string,
    handlers: {
      onStats?: (data: WgServerStatsPayload) => void;
      onStatus?: (data: WgServerStatusPayload) => void;
    },
  ): () => void;
  unsubscribeServer(serverId: string): void;
  subscribePeer(
    peerId: string,
    handlers: {
      onStats?: (data: WgPeerStatsPayload) => void;
      onStatus?: (data: WgPeerStatusPayload) => void;
      onActive?: (data: WgPeerActivePayload) => void;
    },
  ): () => void;
  unsubscribePeer(peerId: string): void;
}
