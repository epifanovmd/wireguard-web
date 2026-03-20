import { createServiceDecorator } from "@force-dev/utils";

import { IChartPoint } from "~@components/wgChart";
import { EntityHolder } from "~@core/holders";

import {
  WgPeerActivePayload,
  WgPeerStatsPayload,
  WgPeerStatusPayload,
} from "../../socket/events";

export const IPeerStatsStore = createServiceDecorator<IPeerStatsStore>();

export interface IPeerStatsStore {
  holder: EntityHolder<WgPeerStatsPayload>;
  statusHolder: EntityHolder<WgPeerStatusPayload>;
  activeHolder: EntityHolder<WgPeerActivePayload>;
  stats: WgPeerStatsPayload | null;
  status: WgPeerStatusPayload | null;
  active: WgPeerActivePayload | null;
  speedPoints: IChartPoint[];
  trafficPoints: IChartPoint[];
  subscribe(peerId: string, from?: string, to?: string): () => void;
}
