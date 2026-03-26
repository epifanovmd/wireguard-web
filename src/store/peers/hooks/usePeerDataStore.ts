import { iocHook } from "@di";

import { IPeerDataStore } from "../PeerDataStore.types";

export const usePeerDataStore = iocHook(IPeerDataStore);
