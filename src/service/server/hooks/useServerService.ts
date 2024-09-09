import { iocHook } from "@force-dev/react";

import { IServerService } from "../Server.types";

export const useServerService = iocHook(IServerService);
