import { createServiceDecorator, DataHolder } from "@force-dev/utils";

import { IChartPoint } from "~@components/wgChart";

import { WgPeerStatsPayload, WgPeerStatusPayload } from "../../socket/events";

export const IPeerStatsStore = createServiceDecorator<IPeerStatsStore>();

export interface IPeerStatsStore {
  holder: DataHolder<WgPeerStatsPayload>;
  statusHolder: DataHolder<WgPeerStatusPayload>;
  stats: WgPeerStatsPayload | undefined;
  status: WgPeerStatusPayload | undefined;
  speedPoints: IChartPoint[];
  trafficPoints: IChartPoint[];
  subscribe(peerId: string, from?: string, to?: string): () => void;
}
