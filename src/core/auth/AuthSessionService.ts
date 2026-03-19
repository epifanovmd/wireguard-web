import { createServiceDecorator } from "@force-dev/utils";
import axios from "axios";

import { BASE_URL } from "../env";
import { IAuthTokenStore } from "./AuthTokenStore";

const REFRESH_PATH = "/api/auth/refresh";

type RefreshResponse = { accessToken: string; refreshToken: string };

export const IAuthSessionService =
  createServiceDecorator<IAuthSessionService>();

export interface IAuthSessionService {
  readonly accessToken: string;

  setTokens(accessToken: string, refreshToken: string): void;
  clearTokens(): void;
  restoreSession(): Promise<boolean>;
  ensureFreshToken(): Promise<void>;
  refreshToken(): Promise<void>;
}

@IAuthSessionService({ inSingleton: true })
export class AuthSessionService implements IAuthSessionService {
  private _refreshPromise: Promise<void> | null = null;

  private readonly _axios = axios.create({
    baseURL: BASE_URL,
    timeout: 10_000,
    withCredentials: true,
  });

  constructor(@IAuthTokenStore() private _tokenStore: IAuthTokenStore) {}

  get accessToken(): string {
    return this._tokenStore.accessToken;
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this._tokenStore.setTokens(accessToken, refreshToken);
  }

  clearTokens(): void {
    this._tokenStore.clear();
  }

  async restoreSession(): Promise<boolean> {
    const token = this._tokenStore.restoreRefreshToken();

    if (!token) return false;

    try {
      // Use _forceRefresh to deduplicate concurrent restore calls.
      // Without this, two simultaneous navigations could both call _doRefresh()
      // with the same single-use refresh token — the second would fail and clear the session.
      await this._forceRefresh();
    } catch {
      return false;
    }

    return !!this._tokenStore.accessToken;
  }

  async ensureFreshToken(): Promise<void> {
    if (!this._tokenStore.refreshToken) return;
    if (!this._tokenStore.isTokenExpiringSoon()) return;

    return this._forceRefresh();
  }

  refreshToken(): Promise<void> {
    return this._forceRefresh();
  }

  private async _doRefresh(): Promise<void> {
    const refreshToken = this._tokenStore.refreshToken;

    if (!refreshToken) {
      this._tokenStore.clear();
      throw new Error("No refresh token available");
    }

    try {
      const { data } = await this._axios.post<RefreshResponse>(REFRESH_PATH, {
        refreshToken,
      });

      this._tokenStore.setTokens(data.accessToken, data.refreshToken);
    } catch (error) {
      this._tokenStore.clear();
      throw error;
    }
  }

  private _forceRefresh(): Promise<void> {
    if (!this._refreshPromise) {
      this._refreshPromise = this._doRefresh().finally(() => {
        this._refreshPromise = null;
      });
    }

    return this._refreshPromise;
  }
}
