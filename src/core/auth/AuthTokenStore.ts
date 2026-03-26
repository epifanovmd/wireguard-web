import { createServiceDecorator } from "@di";
import { makeAutoObservable } from "mobx";

const REFRESH_TOKEN_KEY = "app:refresh_token";

export const IAuthTokenStore = createServiceDecorator<IAuthTokenStore>();

export interface IAuthTokenStore {
  accessToken: string;
  refreshToken: string;

  isTokenExpiringSoon(bufferSeconds?: number): boolean;
  setTokens(accessToken: string, refreshToken: string): void;
  restoreRefreshToken(): string | null;
  clear(): void;
}

@IAuthTokenStore({ inSingleton: true })
export class AuthTokenStore implements IAuthTokenStore {
  public accessToken = "";
  public refreshToken = "";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  isTokenExpiringSoon(bufferSeconds = 60): boolean {
    if (!this.accessToken) return true;
    try {
      const payload = JSON.parse(atob(this.accessToken.split(".")[1]));

      return Date.now() / 1000 > payload.exp - bufferSeconds;
    } catch {
      return true;
    }
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;

    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }

  restoreRefreshToken(): string | null {
    const token = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (token) {
      this.refreshToken = token;
    }

    return token;
  }

  clear(): void {
    this.accessToken = "";
    this.refreshToken = "";
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}
