import { createServiceDecorator, DataHolder } from "@force-dev/utils";

import { IChartPoint } from "~@components/wgChart";

import {
  WgPeerActivePayload,
  WgPeerStatsPayload,
  WgPeerStatusPayload,
} from "../../socket/events";

export const IPeerStatsStore = createServiceDecorator<IPeerStatsStore>();

export interface IPeerStatsStore {
  holder: DataHolder<WgPeerStatsPayload>;
  statusHolder: DataHolder<WgPeerStatusPayload>;
  activeHolder: DataHolder<WgPeerActivePayload>;
  stats: WgPeerStatsPayload | undefined;
  status: WgPeerStatusPayload | undefined;
  active: WgPeerActivePayload | undefined;
  speedPoints: IChartPoint[];
  trafficPoints: IChartPoint[];
  subscribe(peerId: string, from?: string, to?: string): () => void;
}
