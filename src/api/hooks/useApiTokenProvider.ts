import { iocHook } from "@force-dev/react";

import { IApiTokenProvider } from "../ApiToken.provider";

export const useApiTokenProvider = iocHook(IApiTokenProvider);
