import { createServiceDecorator } from "@force-dev/utils";

import { IChartPoint } from "~@components/wgChart";
import { EntityHolder } from "~@core/holders";

import { WgOverviewStatsPayload } from "../../socket/events";

export const IOverviewStatsStore =
  createServiceDecorator<IOverviewStatsStore>();

export interface IOverviewStatsStore {
  holder: EntityHolder<WgOverviewStatsPayload>;
  stats: WgOverviewStatsPayload | null;
  speedPoints: IChartPoint[];
  trafficPoints: IChartPoint[];
  subscribe(): () => void;
}
