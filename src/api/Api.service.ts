import { promisify } from "@force-dev/utils";
import { InternalAxiosRequestConfig } from "axios";

import { ApiRequestConfig, ApiResponse, IApiService } from "./Api.types";
import { IAxiosInstance, IAxiosInstancePromise } from "./axios";

@IApiService({ inSingleton: true })
export class ApiService implements IApiService {
  constructor(
    @IAxiosInstance() private instance: IAxiosInstance,
    @IAxiosInstancePromise() private instancePromise: IAxiosInstancePromise,
  ) {}

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
    return this.instancePromise<R>(
      { url: endpoint, method: "GET", params },
      config,
    );
  }

  public post<R = any, P = any>(
    endpoint: string,
    params?: P,
    config?: ApiRequestConfig,
  ) {
    return this.instancePromise<R>(
      { url: endpoint, method: "POST", data: params },
      config,
    );
  }

  public patch<R = any, P = any>(
    endpoint: string,
    params?: P,
    config?: ApiRequestConfig,
  ) {
    return this.instancePromise<R>(
      { url: endpoint, method: "PATCH", data: params },
      config,
    );
  }

  public put<R = any, P = any>(
    endpoint: string,
    params?: P,
    config?: ApiRequestConfig,
  ) {
    return this.instancePromise<R>(
      { url: endpoint, method: "PUT", data: params },
      config,
    );
  }

  public delete<R = any>(endpoint: string, config?: ApiRequestConfig) {
    return this.instancePromise<R>({ url: endpoint, method: "DELETE" }, config);
  }
}
