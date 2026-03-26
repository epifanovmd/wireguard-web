import { iocHook } from "@common/ioc";

import { IApiService } from "../Api.types";

export const useApi = iocHook(IApiService);
