import { createServiceDecorator } from "@di";
import { EntityHolder } from "@store";

import { WgOverviewStatsPayload } from "../../socket";
import { StatsChartBase } from "../shared/StatsChartBase";

export const IOverviewStatsStore =
  createServiceDecorator<IOverviewStatsStore>();

export interface IOverviewStatsStore extends StatsChartBase {
  holder: EntityHolder<WgOverviewStatsPayload>;
  stats: WgOverviewStatsPayload | null;

  load(from?: string, to?: string): Promise<void>;
  subscribe(from?: string, to?: string): () => void;
}
