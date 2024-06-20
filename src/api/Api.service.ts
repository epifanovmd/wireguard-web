import { iocHook } from "@force-dev/react";
import axios, { AxiosInstance } from "axios";
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

export const useApiService = iocHook(IApiService);

@IApiService({ inSingleton: true })
export class ApiService implements IApiService {
  private instance: AxiosInstance;
  private raceConditionMap: Map<string, AbortController> = new Map();
  private token: string = "";

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

    this.instance.interceptors.request.use(async request => {
      if (this.token) {
        request.headers.set("Authorization", `Bearer ${this.token}`);
      }

      // if (import.meta.env.DEV) {
      //   console.log(
      //     "Start request with url = ",
      //     request.url,
      //     "params = ",
      //     JSON.stringify(request.params ?? request.data ?? {}),
      //   );
      // }

      return request;
    });

    this.instance.interceptors.response.use(
      response => {
        const status = response.status;
        const data = response.data;

        return { data, status } satisfies ApiResponse<any> as any;
      },
      e => {
        return Promise.resolve({
          status: e?.response?.status || 400,
          error: new Error(e.message ?? e.response.data ?? e),
        } satisfies ApiResponse<any>);
      },
    );
  }

  setToken = (token: string) => {
    this.token = token;
  };

  public onError = (
    callback: (params: {
      status: number;
      error: Error;
      isCanceled: boolean;
    }) => void,
  ) => {
    this.instance.interceptors.response.use(((response: ApiResponse<any>) => {
      if (response.error) {
        callback({
          status: response.status,
          error: response.error,
          isCanceled: response.error.message === "canceled",
        });
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
    const controller = this.raceCondition(endpoint, config?.useRaceCondition);

    const promise = this.instance
      .get<ApiResponse<R>>(endpoint + (query ? `?${query}` : ""), {
        ...config,
        signal: controller.signal,
      })
      .then(response => response) as ApiAbortPromise<ApiResponse<R>>;

    promise.abort = () => controller.abort();

    return promise;
  }

  public post<R = any, P = any>(
    endpoint: string,
    params?: P,
    config?: ApiRequestConfig,
  ) {
    const controller = this.raceCondition(endpoint, config?.useRaceCondition);

    const promise = this.instance
      .post<ApiResponse<R>>(endpoint, params, {
        ...config,
        signal: controller.signal,
      })
      .then(response => response) as ApiAbortPromise<ApiResponse<R>>;

    promise.abort = () => controller.abort();

    return promise;
  }

  public patch<R = any, P = any>(
    endpoint: string,
    params?: P,
    config?: ApiRequestConfig,
  ) {
    const controller = this.raceCondition(endpoint, config?.useRaceCondition);

    const promise = this.instance
      .patch<ApiResponse<R>>(endpoint, params, {
        ...config,
        signal: controller.signal,
      })
      .then(response => response) as ApiAbortPromise<ApiResponse<R>>;

    promise.abort = () => controller.abort();

    return promise;
  }

  public put<R = any, P = any>(
    endpoint: string,
    params?: P,
    config?: ApiRequestConfig,
  ) {
    const controller = this.raceCondition(endpoint, config?.useRaceCondition);

    const promise = this.instance
      .put<ApiResponse<R>>(endpoint, params, {
        ...config,
        signal: controller.signal,
      })
      .then(response => response) as ApiAbortPromise<ApiResponse<R>>;

    promise.abort = () => controller.abort();

    return promise;
  }

  public delete<R = any>(endpoint: string, config?: ApiRequestConfig) {
    const controller = this.raceCondition(endpoint, config?.useRaceCondition);

    const promise = this.instance
      .delete(endpoint, {
        ...config,
        signal: controller.signal,
      })
      .then(response => response) as ApiAbortPromise<ApiResponse<R>>;

    promise.abort = () => controller.abort();

    return promise;
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
}
