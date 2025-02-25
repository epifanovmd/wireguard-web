import { createServiceDecorator } from "@force-dev/utils";

export const ITokenService = createServiceDecorator<ITokenService>();

export interface ITokenService {
  accessToken: string;
  refreshToken: string;

  setTokens(accessToken: string, refreshToken: string): void;

  restoreRefreshToken(): Promise<string>;

  clear(): void;
}
