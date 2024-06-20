import { iocHook } from "@force-dev/react";

import { ISessionDataStore } from "../SessionData.types";

export const useSessionDataStore = iocHook(ISessionDataStore);
