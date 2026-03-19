import { IAuthSessionService } from "~@core/auth";
import { BASE_URL } from "~@core/env";

import { ApiError, IApiService } from "./Api.types";
import { Api } from "./api-gen/Api";

@IApiService({ inSingleton: true })
class ApiService extends Api<ApiError, ApiError> implements IApiService {
  constructor(@IAuthSessionService() private _session: IAuthSessionService) {
    super(
      { baseURL: BASE_URL, timeout: 2 * 60 * 1000, withCredentials: true },
      ApiError.fromAxiosError,
    );

    this._setupInterceptors();
  }

  // ─── Interceptors ────────────────────────────────────────────────────────────

  private _setupInterceptors(): void {
    this.instance.interceptors.request.use(async request => {
      await this._session.ensureFreshToken();

      const token = this._session.accessToken;

      if (token) {
        request.headers.set("Authorization", `Bearer ${token}`);
      }

      return request;
    });

    this.instance.interceptors.response.use(undefined, async error => {
      if (error.response?.status === 401 && !error.config?._retry) {
        error.config._retry = true;

        try {
          await this._session.refreshToken();
        } catch {
          return Promise.reject(error);
        }

        const token = this._session.accessToken;

        if (token) {
          error.config.headers["Authorization"] = `Bearer ${token}`;

          return this.instance(error.config);
        }
      }

      return Promise.reject(error);
    });
  }
}
