import { iocHook } from "@force-dev/react";

import { IPeerDataStore } from "../PeerDataStore.types";

export const usePeerDataStore = iocHook(IPeerDataStore);
