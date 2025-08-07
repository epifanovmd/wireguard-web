import { iocHook } from "@force-dev/react";

import { IApiService } from "../Api.types";

export const useApi = iocHook(IApiService);
