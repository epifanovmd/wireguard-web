import { iocHook } from "@di";

import { IServerDetailStore } from "../ServerDetailStore.types";

export const useServerDetailStore = iocHook(IServerDetailStore);
