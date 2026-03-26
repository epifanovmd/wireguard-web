import { IAuthSessionService } from "@core/auth";
import { BASE_URL } from "@core/env";
import { INotificationService } from "@core/notifications";
import axios, {
  AxiosHeaders,
  AxiosResponse,
  CanceledError,
  CancelTokenSource,
  isAxiosError,
} from "axios";

import { ApiError, ApiServiceResponse, IApiService } from "./Api.types";
import { Api } from "./api-gen/Api";
import {
  ApiRequestConfig,
  ApiResponse,
  CancelablePromise,
} from "./api-gen/http-client";
import { QueryRace } from "./QueryRace";

export { BASE_URL };
export { SOCKET_BASE_URL } from "@core/env";

const DEFAULT_HEADERS = new AxiosHeaders({
  Accept: "application/json",
  "Content-Type": "application/json",
});

@IApiService({ inSingleton: true })
class ApiService extends Api<ApiError> implements IApiService {
  private readonly _instance;
  private readonly _queryRace = new QueryRace();

  constructor(
    @IAuthSessionService() private _session: IAuthSessionService,
    @INotificationService() private _notifications: INotificationService,
  ) {
    super();

    this._instance = axios.create({
      baseURL: BASE_URL,
      timeout: 2 * 60 * 1000,
      withCredentials: true,
      headers: DEFAULT_HEADERS,
    });

    this._setupInterceptors();
  }

  get instance() {
    return this._instance;
  }

  // --- Abstract implementation from HttpClient -----------------------------

  instancePromise<R = any, P = any>(
    config: ApiRequestConfig<P>,
    options?: ApiRequestConfig<P>,
  ): CancelablePromise<ApiResponse<R, ApiError>> {
    const source: CancelTokenSource = axios.CancelToken.source();
    const endpoint = `${config.method ?? "GET"} ${config.url}`;

    if (options?.useQueryRace !== false) {
      this._queryRace.apply(endpoint, source.cancel);
    }

    const promise = this._instance({
      ...config,
      ...options,
      cancelToken: source.token,
    }) as CancelablePromise<ApiResponse<R, ApiError>>;

    promise.finally(() => this._queryRace.delete(endpoint));
    promise.cancel = (message?: string) =>
      source.cancel(message ?? "Query was cancelled");

    return promise;
  }

  // --- Interceptors --------------------------------------------------------

  private _setupInterceptors(): void {
    // Inject auth token before each request
    this._instance.interceptors.request.use(async request => {
      await this._session.ensureFreshToken();

      const token = this._session.accessToken;

      if (token) {
        request.headers.set("Authorization", `Bearer ${token}`);
      }

      return request;
    });

    // Wrap response/error into ApiResponse + handle 401 retry + global notifications
    (this._instance.interceptors.response as any).use(
      (res: AxiosResponse): ApiServiceResponse<any> => ({
        data: res.data,
        status: res.status,
        axiosResponse: res,
      }),
      async (e: any): Promise<ApiServiceResponse<any>> => {
        const axiosError = isAxiosError(e) ? e : undefined;
        const status = e.response?.status || e.request?.status || 400;

        // 401 — attempt token refresh and retry once
        const config = axiosError?.config as any;

        if (status === 401 && config && !config._retry) {
          config._retry = true;

          try {
            await this._session.refreshToken();
          } catch {
            return {
              status,
              error: ApiError.fromAxiosError(axiosError!),
              axiosError,
            };
          }

          return this.instancePromise(config, {
            useQueryRace: false,
          }) as unknown as Promise<ApiServiceResponse<any>>;
        }

        // Global notifications for infrastructure errors
        const apiError = ApiError.fromAxiosError(axiosError!);

        if (apiError.isNetworkError) {
          this._notifications.error("Нет соединения с сервером", {
            duration: 6000,
          });
        } else if (apiError.isServerError) {
          this._notifications.error(
            apiError.message || "Внутренняя ошибка сервера",
          );
        }

        return {
          status,
          error: apiError,
          axiosError,
          isCanceled: e instanceof CanceledError,
        };
      },
    );
  }
}
