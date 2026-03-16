import { iocHook } from "@force-dev/react";

import { IPeersDataStore } from "../PeersData.types";

export const usePeersDataStore = iocHook(IPeersDataStore);
