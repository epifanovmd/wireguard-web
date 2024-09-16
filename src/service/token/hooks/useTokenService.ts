import { iocHook } from "@force-dev/react";

import { ITokenService } from "../Token.types";

export const useTokenService = iocHook(ITokenService);
