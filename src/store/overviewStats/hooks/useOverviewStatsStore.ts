import { iocHook } from "~@common/ioc";

import { IOverviewStatsStore } from "../OverviewStats.types";

export const useOverviewStatsStore = iocHook(IOverviewStatsStore);
