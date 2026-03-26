import { iocHook } from "@di";

import { ISocketTransport } from "../socketTransport.types";

export const socketTransportHooks = iocHook(ISocketTransport);
