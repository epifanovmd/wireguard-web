import { iocHook } from "@force-dev/react";

import { IStatsDataStore } from "../StatsData.types";

export const useStatsDataStore = iocHook(IStatsDataStore);
