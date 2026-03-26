import { iocHook } from "@di";

import { IServerStatsStore } from "../ServerStats.types";

export const useServerStatsStore = iocHook(IServerStatsStore);
