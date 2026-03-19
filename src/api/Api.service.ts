import { IAuthSessionService } from "~@core/auth";
import { BASE_URL } from "~@core/env";
import { INotificationService } from "~@core/notifications";

import { ApiError, IApiService } from "./Api.types";
import { Api } from "./api-gen/Api";

export { BASE_URL };
export { SOCKET_BASE_URL } from "~@core/env";

@IApiService({ inSingleton: true })
 
class ApiService extends Api<ApiError, ApiError> implements IApiService {
  constructor(
    @IAuthSessionService() private _session: IAuthSessionService,
    @INotificationService() private _notifications: INotificationService,
  ) {
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
      // ── 401: attempt token refresh and retry ──────────────────────────────
      if (error.response?.status === 401 && !error.config?._retry) {
        error.config._retry = true;

        try {
          await this._session.refreshToken();
        } catch {
          // Refresh failed — tokens cleared, AppDataStore redirects to /auth/signIn.
          // No toast needed: the navigation itself signals session expiry.
          return Promise.reject(error);
        }

        const token = this._session.accessToken;

        if (token) {
          error.config.headers["Authorization"] = `Bearer ${token}`;

          return this.instance(error.config);
        }

        return Promise.reject(error);
      }

      // ── Global notifications for infrastructure errors ────────────────────
      // Business errors (403, 404, 409, 422) are handled by the feature layer.
      const apiError = ApiError.fromAxiosError(error);

      if (apiError.isNetworkError) {
        this._notifications.error("Нет соединения с сервером", {
          duration: 6000,
        });
      } else if (apiError.isServerError) {
        this._notifications.error(
          apiError.message || "Внутренняя ошибка сервера",
        );
      }

      return Promise.reject(error);
    });
  }
}
