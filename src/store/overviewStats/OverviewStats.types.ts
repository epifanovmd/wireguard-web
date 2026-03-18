import { createServiceDecorator, DataHolder } from "@force-dev/utils";

import { IChartPoint } from "~@components/wgChart";

import { WgOverviewStatsPayload } from "../../socket/events";

export const IOverviewStatsStore =
  createServiceDecorator<IOverviewStatsStore>();

export interface IOverviewStatsStore {
  holder: DataHolder<WgOverviewStatsPayload>;
  stats: WgOverviewStatsPayload | undefined;
  speedPoints: IChartPoint[];
  trafficPoints: IChartPoint[];
  subscribe(): () => void;
}
