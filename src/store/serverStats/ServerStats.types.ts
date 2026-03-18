import { createServiceDecorator, DataHolder } from "@force-dev/utils";

import { IChartPoint } from "~@components/wgChart";

import { WgServerStatsPayload, WgServerStatusPayload } from "../../socket";

export const IServerStatsStore = createServiceDecorator<IServerStatsStore>();

export interface IServerStatsStore {
  statusHolder: DataHolder<WgServerStatusPayload>;
  speedPointsHolder: DataHolder<IChartPoint[]>;
  trafficPointsHolder: DataHolder<IChartPoint[]>;

  stats: WgServerStatsPayload | undefined;
  status: WgServerStatusPayload | undefined;
  speedPoints: IChartPoint[];
  trafficPoints: IChartPoint[];

  loadServerStats(serverId: string, from?: string, to?: string): Promise<void>;
  subscribe(serverId: string): () => void;
  unsubscribe(serverId: string): void;
}
