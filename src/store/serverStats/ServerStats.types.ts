import { createServiceDecorator } from "@force-dev/utils";

import { IChartPoint } from "~@components/wgChart";
import { EntityHolder } from "~@core/holders";

import { WgServerStatsPayload, WgServerStatusPayload } from "../../socket";

export const IServerStatsStore = createServiceDecorator<IServerStatsStore>();

export interface IServerStatsStore {
  holder: EntityHolder<WgServerStatsPayload>;
  statusHolder: EntityHolder<WgServerStatusPayload>;
  isLoading: boolean;

  stats: WgServerStatsPayload | null;
  status: WgServerStatusPayload | null;
  speedPoints: IChartPoint[];
  trafficPoints: IChartPoint[];

  load(serverId: string, from?: string, to?: string): Promise<void>;
  subscribe(serverId: string, from?: string, to?: string): () => void;
  unsubscribe(serverId: string): void;
}
