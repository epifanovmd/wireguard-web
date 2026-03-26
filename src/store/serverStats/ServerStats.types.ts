import { createServiceDecorator } from "@common/ioc";
import { EntityHolder } from "@common/store";

import { WgServerStatsPayload, WgServerStatusPayload } from "../../socket";
import { StatsChartBase } from "../shared/StatsChartBase";

export const IServerStatsStore = createServiceDecorator<IServerStatsStore>();

export interface IServerStatsStore extends StatsChartBase {
  holder: EntityHolder<WgServerStatsPayload>;
  statusHolder: EntityHolder<WgServerStatusPayload>;

  stats: WgServerStatsPayload | null;
  status: WgServerStatusPayload | null;

  load(
    serverId: string,
    from?: string,
    to?: string,
    peerId?: string,
  ): Promise<void>;
  subscribe(
    serverId: string,
    from?: string,
    to?: string,
    peerId?: string,
  ): () => void;
  unsubscribe(serverId: string): void;
}
