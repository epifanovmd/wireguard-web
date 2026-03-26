import { iocHook } from "@di";

import { IOverviewStatsStore } from "../OverviewStats.types";

export const useOverviewStatsStore = iocHook(IOverviewStatsStore);
