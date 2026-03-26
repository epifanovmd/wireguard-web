import { iocHook } from "~@common/ioc";

import { IServerStatsStore } from "../ServerStats.types";

export const useServerStatsStore = iocHook(IServerStatsStore);
