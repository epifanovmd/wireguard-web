import { iocHook } from "@common/ioc";

import { IWgPeersLiveStore } from "../PeersLive.types";

export const useWgPeersLiveStore = iocHook(IWgPeersLiveStore);
