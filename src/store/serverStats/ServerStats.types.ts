import { createServiceDecorator } from "@force-dev/utils";

import { IChartPoint } from "~@components/wgChart";
import { EntityHolder } from "~@core/holders";

import { WgServerStatsPayload, WgServerStatusPayload } from "../../socket";

export const IServerStatsStore = createServiceDecorator<IServerStatsStore>();

export interface IServerStatsStore {
  holder: EntityHolder<WgServerStatsPayload>;
  statusHolder: EntityHolder<WgServerStatusPayload>;
  speedPointsHolder: EntityHolder<IChartPoint[]>;
  trafficPointsHolder: EntityHolder<IChartPoint[]>;

  stats: WgServerStatsPayload | null;
  status: WgServerStatusPayload | null;
  speedPoints: IChartPoint[];
  trafficPoints: IChartPoint[];

  loadServerStats(serverId: string, from?: string, to?: string): Promise<void>;
  subscribe(serverId: string): () => void;
  unsubscribe(serverId: string): void;
}
