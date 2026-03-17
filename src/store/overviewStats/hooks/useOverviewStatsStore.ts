import { iocHook } from "@force-dev/react";

import { IOverviewStatsStore } from "../OverviewStats.types";

export const useOverviewStatsStore = iocHook(IOverviewStatsStore);
