import { iocHook } from "@di";

import { IWgPeersLiveStore } from "../PeersLive.types";

export const useWgPeersLiveStore = iocHook(IWgPeersLiveStore);
