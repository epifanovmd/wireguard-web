import { promisify } from "@force-dev/utils";
import axios, {
  Axios,
  AxiosHeaders,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { stringify } from "query-string";

// не менять путь, иначе появистя циклическая зависимость
import { ITokenService } from "../service/token";
import {
  ApiAbortPromise,
  ApiRequestConfig,
  ApiResponse,
  IApiService,
} from "./Api.types";

export const BASE_URL =
  import.meta.env.MODE === "development"
    ? undefined
    : import.meta.env.VITE_BASE_URL;
export const SOCKET_BASE_URL = import.meta.env.VITE_SOCKET_BASE_URL;

export const DEFAULT_AXIOS_HEADERS = new AxiosHeaders({
  Accept: "application/json",
  "Content-Type": "application/json",
});

@IApiService({ inSingleton: true })
export class ApiService implements IApiService {
  private instance: AxiosInstance;
  private raceConditionMap: Map<string, AbortController> = new Map();

  constructor(@ITokenService() private _tokenService: ITokenService) {
    this.instance = axios.create({
      timeout: 2 * 60 * 1000,
      withCredentials: true,
      baseURL: BASE_URL,
      headers: DEFAULT_AXIOS_HEADERS,
    });

    this.instance.interceptors.request.use(async request => {
      const headers = request.headers;
      const token = this._tokenService.accessToken;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return request;
    });

    this.instance.interceptors.response.use(
      response => {
        const status = response.status;
        const data = response.data;

        return Promise.resolve<ApiResponse>({ data, status }) as any;
      },
      e => {
        const error = new Error(e.message ?? e);

        if (e.response) {
          const errorData = e.response.data;

          return Promise.resolve<ApiResponse>({
            status: e.response.status || 500,
            error: errorData ? new Error(JSON.stringify(errorData)) : error,
          });
        } else if (e.request) {
          return Promise.resolve<ApiResponse>({
            status: e.request.status || 400,
            error,
          });
        } else {
          return Promise.resolve<ApiResponse>({
            status: 400,
            error,
            isCanceled: e.message === "canceled",
          });
        }
      },
    );
  }

  public onRequest = (
    callback: (
      request: InternalAxiosRequestConfig,
    ) =>
      | void
      | InternalAxiosRequestConfig
      | Promise<void | InternalAxiosRequestConfig>,
  ) => {
    this.instance.interceptors.request.use(async request => {
      return (await promisify(callback(request))) ?? request;
    });
  };

  public onResponse = (
    callback: (
      response: ApiResponse,
    ) => void | ApiResponse | Promise<void | ApiResponse>,
  ) => {
    this.instance.interceptors.response.use((async (response: ApiResponse) => {
      if (!response.error && response.data) {
        return (await promisify(callback(response))) ?? response;
      }

      return response;
    }) as any);
  };

  public onError = (
    callback: (
      response: ApiResponse,
    ) => void | ApiResponse | Promise<void | ApiResponse>,
  ) => {
    this.instance.interceptors.response.use((async (response: ApiResponse) => {
      if (response.error) {
        return (await promisify(callback(response))) ?? response;
      }

      return response;
    }) as any);
  };

  public get<R = any, P = any>(
    endpoint: string,
    params?: P,
    config?: ApiRequestConfig,
  ) {
    const query = params && stringify(params);

    return this._createAbortRequest<R, P>(
      "get",
      endpoint + (query ? `?${query}` : ""),
      config,
      params,
    );
  }

  public post<R = any, P = any>(
    endpoint: string,
    params?: P,
    config?: ApiRequestConfig,
  ) {
    return this._createAbortRequest<R, P>("post", endpoint, config, params);
  }

  public patch<R = any, P = any>(
    endpoint: string,
    params?: P,
    config?: ApiRequestConfig,
  ) {
    return this._createAbortRequest<R, P>("patch", endpoint, config, params);
  }

  public put<R = any, P = any>(
    endpoint: string,
    params?: P,
    config?: ApiRequestConfig,
  ) {
    return this._createAbortRequest<R, P>("put", endpoint, config, params);
  }

  public delete<R = any>(endpoint: string, config?: ApiRequestConfig) {
    return this._createAbortRequest<R>("delete", endpoint, config);
  }

  private raceCondition(endpoint: string, useRaceCondition?: boolean) {
    const controller = new AbortController();

    if (useRaceCondition) {
      if (this.raceConditionMap.has(endpoint)) {
        this.raceConditionMap.get(endpoint)?.abort();
        this.raceConditionMap.delete(endpoint);
      }
      this.raceConditionMap.set(endpoint, controller);
    }

    return controller;
  }

  private _createAbortRequest = <R, P = unknown>(
    key: keyof Pick<Axios, "get" | "delete" | "post" | "put" | "patch">,
    endpoint: string,
    config?: ApiRequestConfig,
    params?: P,
  ) => {
    const controller = this.raceCondition(endpoint, config?.useRaceCondition);
    const method = this.instance[key];
    const conf = {
      ...config,
      signal: controller.signal,
    };

    let promise: ApiAbortPromise<ApiResponse<R>>;

    if (key === "get" || key === "delete") {
      promise = method(endpoint, conf).then(
        response => response,
      ) as ApiAbortPromise<ApiResponse<R>>;
    } else {
      promise = method(endpoint, params, conf).then(
        response => response,
      ) as ApiAbortPromise<ApiResponse<R>>;
    }

    promise.abort = () => controller.abort();

    return promise;
  };
}
