import axios, { AxiosInstance } from "axios";
import Cookie from "js-cookie";
import { stringify } from "query-string";

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

@IApiService({ inSingleton: true })
export class ApiService implements IApiService {
  private instance: AxiosInstance;
  private raceConditionMap: Map<string, AbortController> = new Map();

  constructor() {
    this.instance = axios.create({
      timeout: 2 * 60 * 1000,
      withCredentials: true,
      baseURL: BASE_URL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    this.instance.interceptors.response.use(
      response => ({ data: response }),
      error => {
        if (import.meta.env.DEV) {
          console.group("AXIOS ERROR INTERCEPT LOG");
          console.log("ERROR --> ", error);
          console.log("STRINGIFY ERROR --> ", JSON.stringify(error));
          console.groupEnd();
        }

        const status = error?.response?.status || 500;

        if (status === 401) {
          Cookie.remove("access_token");
          Cookie.remove("refresh_token");
        }

        if (error && error?.message !== "canceled") {
          return Promise.resolve({
            data: {
              error:
                error.message ||
                error.response?.data?.error ||
                error.response?.data,
            },
          });
        }

        return Promise.resolve({ data: {} });
      },
    );
  }

  public get hostname() {
    return BASE_URL.replace("api/", "") || "/";
  }

  public toAbsoluteUrl(url?: string) {
    if (!url) {
      return undefined;
    }

    const regexp = new RegExp(/(http(s?)|file):\/\//);

    if (regexp.test(url) || url.includes("://")) {
      return url;
    }

    return `${this.hostname}${url}`.replace("///", "//");
  }

  public get<R = any, P = any>(
    endpoint: string,
    params?: P,
    config?: ApiRequestConfig,
  ) {
    const query = params && stringify(params);
    const controller = this._raceCondition(endpoint, config?.useRaceCondition);

    const promise = this.instance
      .get<ApiResponse<R>>(endpoint + (query ? `?${query}` : ""), {
        ...config,
        signal: controller.signal,
      })
      .then(response => response.data) as ApiAbortPromise<ApiResponse<R>>;

    promise.abort = () => controller.abort();

    return promise;
  }

  public post<R = any, P = any>(
    endpoint: string,
    params?: P,
    config?: ApiRequestConfig,
  ) {
    const controller = this._raceCondition(endpoint, config?.useRaceCondition);

    const promise = this.instance
      .post<ApiResponse<R>>(endpoint, params, {
        ...config,
        signal: controller.signal,
      })
      .then(response => response.data) as ApiAbortPromise<ApiResponse<R>>;

    promise.abort = () => controller.abort();

    return promise;
  }

  public patch<R = any, P = any>(
    endpoint: string,
    params?: P,
    config?: ApiRequestConfig,
  ) {
    const controller = this._raceCondition(endpoint, config?.useRaceCondition);

    const promise = this.instance
      .patch<ApiResponse<R>>(endpoint, params, {
        ...config,
        signal: controller.signal,
      })
      .then(response => response.data) as ApiAbortPromise<ApiResponse<R>>;

    promise.abort = () => controller.abort();

    return promise;
  }

  public put<R = any, P = any>(
    endpoint: string,
    params?: P,
    config?: ApiRequestConfig,
  ) {
    const controller = this._raceCondition(endpoint, config?.useRaceCondition);

    const promise = this.instance
      .put<ApiResponse<R>>(endpoint, params, {
        ...config,
        signal: controller.signal,
      })
      .then(response => response.data) as ApiAbortPromise<ApiResponse<R>>;

    promise.abort = () => controller.abort();

    return promise;
  }

  public delete<R = any>(endpoint: string, config?: ApiRequestConfig) {
    const controller = this._raceCondition(endpoint, config?.useRaceCondition);

    const promise = this.instance
      .delete(endpoint, {
        ...config,
        signal: controller.signal,
      })
      .then(response => response.data) as ApiAbortPromise<ApiResponse<R>>;

    promise.abort = () => controller.abort();

    return promise;
  }

  private _raceCondition(endpoint: string, useRaceCondition?: boolean) {
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
}
