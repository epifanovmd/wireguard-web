import { iocHook } from "@force-dev/react";

import { IClientsService } from "../Client.types";

export const useClientService = iocHook(IClientsService);
