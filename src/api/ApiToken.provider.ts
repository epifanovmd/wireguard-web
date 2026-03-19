import { createServiceDecorator } from "@force-dev/utils";
import { makeAutoObservable } from "mobx";

export const IApiTokenProvider = createServiceDecorator<IApiTokenProvider>();

export interface IApiTokenProvider {
  accessToken: string;
  refreshToken: string;

  isTokenExpiringSoon(bufferSeconds?: number): boolean;

  setTokens(accessToken: string, refreshToken: string): void;

  restoreRefreshToken(): Promise<string>;

  clear(): void;
}

@IApiTokenProvider({ inSingleton: true })
export class ApiTokenProvider implements IApiTokenProvider {
  public accessToken = "";
  public refreshToken = "";

  constructor() {
    this.restoreRefreshToken().then();

    makeAutoObservable(this, {}, { autoBind: true });
  }

  isTokenExpiringSoon(bufferSeconds = 60): boolean {
    if (!this.accessToken) return true;
    try {
      const { exp } = JSON.parse(atob(this.accessToken.split(".")[1]));

      return Date.now() / 1000 > exp - bufferSeconds;
    } catch {
      return true;
    }
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;

    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    } else {
      this.clear();
    }
    this.refreshToken = refreshToken;
  }

  async restoreRefreshToken() {
    const token = await new Promise<string | null>(resolve =>
      resolve(localStorage.getItem("refresh_token")),
    ).then(res => res ?? "");

    this.setTokens(this.accessToken, token);

    return token;
  }

  clear() {
    this.accessToken = "";

    localStorage.removeItem("refresh_token");
    this.refreshToken = "";
  }
}
