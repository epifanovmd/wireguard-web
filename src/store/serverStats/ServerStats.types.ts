import { createServiceDecorator, DataHolder } from "@force-dev/utils";

import { IChartPoint } from "~@components/wgChart";

import { WgServerStatsPayload, WgServerStatusPayload } from "../../socket/events";

export const IServerStatsStore = createServiceDecorator<IServerStatsStore>();

export interface IServerStatsStore {
  holder: DataHolder<WgServerStatsPayload>;
  statusHolder: DataHolder<WgServerStatusPayload>;
  stats: WgServerStatsPayload | undefined;
  status: WgServerStatusPayload | undefined;
  speedPoints: IChartPoint[];
  trafficPoints: IChartPoint[];
  subscribe(serverId: string): () => void;
}
