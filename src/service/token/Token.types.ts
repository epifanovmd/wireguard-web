import { iocDecorator } from "@force-dev/utils";

export const ITokenService = iocDecorator<ITokenService>();

export interface ITokenService {
  accessToken: string;
  refreshToken: string;

  setTokens(accessToken: string, refreshToken: string): void;

  getRefreshToken(): Promise<string>;

  clear(): void;
}
