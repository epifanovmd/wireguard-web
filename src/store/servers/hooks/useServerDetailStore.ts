import { iocHook } from "@force-dev/react";

import { IServerDetailStore } from "../ServerDetailStore.types";

export const useServerDetailStore = iocHook(IServerDetailStore);
