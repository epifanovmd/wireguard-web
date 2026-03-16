import { createServiceDecorator, DataHolder } from "@force-dev/utils";

import {
  IWgPeerStatsResponse,
  IWgServerStatsResponse,
} from "~@api/api-gen/data-contracts";

export const IStatsDataStore = createServiceDecorator<IStatsDataStore>();

export interface IStatsDataStore {
  peerStatsHolder: DataHolder<IWgPeerStatsResponse>;
  serverStatsHolder: DataHolder<IWgServerStatsResponse>;
  peerStats: IWgPeerStatsResponse | undefined;
  serverStats: IWgServerStatsResponse | undefined;
  liveSpeedPoints: { timestamp: number; rx: number; tx: number }[];
  addLiveSpeedPoint(rx: number, tx: number): void;
  loadPeerStats(
    peerId: string,
    from?: string,
    to?: string,
  ): Promise<IWgPeerStatsResponse | undefined>;
  loadServerStats(
    serverId: string,
    from?: string,
    to?: string,
  ): Promise<IWgServerStatsResponse | undefined>;
  loadPeerTraffic(peerId: string, from?: string, to?: string): Promise<any>;
  loadServerTraffic(serverId: string, from?: string, to?: string): Promise<any>;
}
