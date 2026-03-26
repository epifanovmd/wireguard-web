import { iocHook } from "@di";

import { IApiService } from "../Api.types";

export const useApi = iocHook(IApiService);
