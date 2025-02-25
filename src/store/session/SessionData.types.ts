import { createServiceDecorator, SupportInitialize } from "@force-dev/utils";

import { IRefreshTokenResponse } from "~@service";

export const ISessionDataStore = createServiceDecorator<ISessionDataStore>();

export interface ISessionDataStore extends SupportInitialize<() => void> {
  isAuthorized: boolean;
  isReady: boolean;

  restore(tokens?: IRefreshTokenResponse): Promise<string>;
}
