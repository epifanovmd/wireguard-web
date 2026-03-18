import { iocHook } from "@force-dev/react";

import { IPeersListStore } from "../PeersListStore.types";

export const usePeersListStore = iocHook(IPeersListStore);
