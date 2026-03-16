import { createServiceDecorator } from "@force-dev/utils";

import {
  WgOverviewStatsPayload,
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

  subscribeServer(
    serverId: string,
    handlers: {
      onStats?: (data: WgServerStatsPayload) => void;
      onStatus?: (data: WgServerStatusPayload) => void;
    },
  ): () => void;

  subscribePeer(
    peerId: string,
    handlers: {
      onStats?: (data: WgPeerStatsPayload) => void;
      onStatus?: (data: WgPeerStatusPayload) => void;
    },
  ): () => void;
}
