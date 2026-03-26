import { iocHook } from "@common/ioc";

import { ISocketTransport } from "../socketTransport.types";

export const socketTransportHooks = iocHook(ISocketTransport);
