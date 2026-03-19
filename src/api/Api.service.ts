import { ApiError, IApiService } from "./Api.types";
import { Api } from "./api-gen/Api";
import { IApiTokenProvider } from "./ApiToken.provider";

const env = import.meta.env;
const isDev = env.MODE === "development";

const DEV_BASE_URL = `${env.VITE_PROTOCOL}://${env.VITE_HOST}:${env.VITE_PORT}`;

export const BASE_URL = isDev ? DEV_BASE_URL : env.VITE_BASE_URL;
export const SOCKET_BASE_URL = env.VITE_SOCKET_BASE_URL;

@IApiService({ inSingleton: true })
class ApiService extends Api<ApiError, ApiError> {
  private _refreshPromise: Promise<void> | null = null;

  constructor(@IApiTokenProvider() private _tokenProvider: IApiTokenProvider) {
    super(
      {
        timeout: 2 * 60 * 1000,
        withCredentials: true,
        baseURL: BASE_URL,
      },
      error => {
        return new ApiError(
          error.response?.data.name ?? error.name,
          error.response?.data.message ?? error.message,
          error.status ?? 400,
          error.response?.data.reason ?? error.cause,
        );
      },
    );

    this.instance.interceptors.request.use(async request => {
      const isRefreshRequest = request.url === "/api/auth/refresh";

      if (!isRefreshRequest) {
        await this._ensureFreshToken();
      }

      const token = this._tokenProvider.accessToken;

      if (token) {
        request.headers.set("Authorization", `Bearer ${token}`);
      }

      return request;
    });

    this.instance.interceptors.response.use(
      res => res,
      async error => {
        const isRefreshRequest = error.config?.url === "/api/auth/refresh";

        if (
          error.response?.status === 401 &&
          !error.config?._retry &&
          !isRefreshRequest
        ) {
          error.config._retry = true;
          await this._forceRefresh();
          const token = this._tokenProvider.accessToken;

          if (token) {
            error.config.headers["Authorization"] = `Bearer ${token}`;

            return this.instance(error.config);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  public async updateToken(): Promise<void> {
    return this._doRefresh();
  }

  private async _doRefresh(): Promise<void> {
    const res = await this.refresh({
      refreshToken: this._tokenProvider.refreshToken,
    });

    if (res.data) {
      this._tokenProvider.setTokens(
        res.data.accessToken,
        res.data.refreshToken,
      );
    } else {
      this._tokenProvider.clear();
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

  private async _ensureFreshToken(): Promise<void> {
    if (!this._tokenProvider.refreshToken) return;
    if (!this._tokenProvider.isTokenExpiringSoon()) return;

    return this._forceRefresh();
  }
}
