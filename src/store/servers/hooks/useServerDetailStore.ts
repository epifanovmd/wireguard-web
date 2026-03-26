import { iocHook } from "@common/ioc";

import { IServerDetailStore } from "../ServerDetailStore.types";

export const useServerDetailStore = iocHook(IServerDetailStore);
