import { iocHook } from "@force-dev/react";

import { IServerStatsStore } from "../ServerStats.types";

export const useServerStatsStore = iocHook(IServerStatsStore);
