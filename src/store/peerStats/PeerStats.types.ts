import { createServiceDecorator } from "~@common/ioc";
import { EntityHolder } from "~@core/holders";

import {
  WgPeerActivePayload,
  WgPeerStatsPayload,
  WgPeerStatusPayload,
} from "../../socket/events";
import { StatsChartBase } from "../shared/StatsChartBase";

export const IPeerStatsStore = createServiceDecorator<IPeerStatsStore>();

export interface IPeerStatsStore extends StatsChartBase {
  holder: EntityHolder<WgPeerStatsPayload>;
  statusHolder: EntityHolder<WgPeerStatusPayload>;
  activeHolder: EntityHolder<WgPeerActivePayload>;

  stats: WgPeerStatsPayload | null;
  status: WgPeerStatusPayload | null;
  active: WgPeerActivePayload | null;

  load(peerId: string, from?: string, to?: string): Promise<void>;
  subscribe(peerId: string, from?: string, to?: string): () => void;
}
