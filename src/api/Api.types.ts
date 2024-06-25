import { iocDecorator } from "@force-dev/utils";
import { InternalAxiosRequestConfig } from "axios";

export interface ApiAbortPromise<T> extends Promise<T> {
  abort: () => void;
}

export interface ApiRequestConfig extends Partial<InternalAxiosRequestConfig> {
  useRaceCondition?: boolean;
}

export const IApiService = iocDecorator<IApiService>();

export interface IApiService {
  onRequest(
    callback: (
      request: InternalAxiosRequestConfig,
    ) =>
      | void
      | InternalAxiosRequestConfig
      | Promise<void | InternalAxiosRequestConfig>,
  ): void;

  onResponse(
    callback: (
      response: ApiResponse,
    ) => void | ApiResponse | Promise<void | ApiResponse>,
  ): void;

  onError(
    callback: (
      response: ApiResponse,
    ) => void | ApiResponse | Promise<void | ApiResponse>,
  ): void;

  get<R = any, P = any>(
    endpoint: string,
    params?: P,
    config?: ApiRequestConfig,
  ): ApiAbortPromise<ApiResponse<R>>;

  post<R = any, P = any>(
    endpoint: string,
    params?: P,
    config?: ApiRequestConfig,
  ): ApiAbortPromise<ApiResponse<R>>;

  patch<R = any, P = any>(
    endpoint: string,
    params?: P,
    config?: ApiRequestConfig,
  ): ApiAbortPromise<ApiResponse<R>>;

  put<R = any, P = any>(
    endpoint: string,
    params?: P,
    config?: ApiRequestConfig,
  ): ApiAbortPromise<ApiResponse<R>>;

  delete<R = any>(
    endpoint: string,
    config?: ApiRequestConfig,
  ): ApiAbortPromise<ApiResponse<R>>;
}

export interface ApiResponse<R = any> {
  data?: R;
  status: number;
  error?: Error;
  isCanceled?: boolean;
}

export type ApiRequest<T extends object = {}> = T & {
  search?: string;
  page?: number;
  limit?: number;
  sortField?: string;
  sort?: "asc" | "dsc";
};
