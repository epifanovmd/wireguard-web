import { ApiAbortPromise, ApiRequestConfig, ApiResponse } from "@api";
import { iocDecorator } from "@force-dev/utils";
// не менять путь, иначе появистя циклическая зависимость
import { ITokenService } from "@service";
import axios, { AxiosHeaders, AxiosRequestConfig, Canceler } from "axios";
const env = import.meta.env;

const devBaseUrl = `${env.VITE_DEV_PROTOCOL}://${env.VITE_DEV_HOST}:${env.VITE_DEV_PORT}`;

export const BASE_URL =
  import.meta.env.MODE === "development" ? devBaseUrl : env.VITE_BASE_URL;
export const SOCKET_BASE_URL = env.VITE_SOCKET_BASE_URL;

export const DEFAULT_AXIOS_HEADERS = new AxiosHeaders({
  Accept: "application/json",
  "Content-Type": "application/json",
});

const raceConditionMap: Map<string, Canceler> = new Map();

export const createAxiosInstance = () => {
  const instance = axios.create({
    timeout: 2 * 60 * 1000,
    withCredentials: true,
    baseURL: BASE_URL,
    headers: DEFAULT_AXIOS_HEADERS,
  });

  instance.interceptors.request.use(async request => {
    const headers = request.headers;
    const token = ITokenService.getInstance().accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return request;
  });

  instance.interceptors.response.use(
    response => {
      const status = response.status;
      const data = response.data;

      return Promise.resolve<ApiResponse>({ data, status }) as any;
    },
    e => {
      const error = new Error(e.message ?? e);

      if (e.response) {
        const errorData = e.response.data as any;

        const errorStatus = errorData?.error?.status;
        const errorMessage = errorData?.error?.message;

        return Promise.resolve<ApiResponse>({
          status: errorStatus ?? e.response.status ?? 500,
          error: errorMessage ? new Error(errorMessage) : error,
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

  return instance;
};

export const axiosInstance = createAxiosInstance();

export const axiosInstancePromise = <T>(
  config: AxiosRequestConfig,
  options?: ApiRequestConfig,
): ApiAbortPromise<ApiResponse<T>> => {
  const source = axios.CancelToken.source();

  const endpoint = (config.method ?? "GET") + config.url;

  if (!options || options.useRaceCondition !== false) {
    if (raceConditionMap.has(endpoint)) {
      raceConditionMap.get(endpoint)?.("Race condition canceled");
      raceConditionMap.delete(endpoint);
    }
    raceConditionMap.set(endpoint, source.cancel);
  }

  const promise = axiosInstance({
    ...config,
    ...options,
    cancelToken: source.token,
  }) as ApiAbortPromise<ApiResponse<T>>;

  promise.finally(() => {
    raceConditionMap.delete(endpoint);
  });

  promise.abort = (message, config, request) => {
    source.cancel(message ?? "Query was cancelled", config, request);
  };

  return promise;
};

export type IAxiosInstance = typeof axiosInstance;
export const IAxiosInstance =
  iocDecorator<IAxiosInstance>().toConstantValue(axiosInstance);

export type IAxiosInstancePromise = typeof axiosInstancePromise;
export const IAxiosInstancePromise =
  iocDecorator<IAxiosInstancePromise>().toConstantValue(axiosInstancePromise);
