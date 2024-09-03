import { iocHook } from "@force-dev/react";

import { IClientConfigurationDataDataStore } from "../ClientConfigurationData.types";

export const useClientConfigurationDataStore = iocHook(
  IClientConfigurationDataDataStore,
);
