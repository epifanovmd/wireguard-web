import { iocHook } from "@force-dev/react";

import { IClientsDataStore } from "../ClientsData.types";

export const useClientsDataStore = iocHook(IClientsDataStore);
