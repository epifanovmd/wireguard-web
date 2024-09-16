import {
  ApiService,
  IApiService as IIIApiService,
  iocDecorator,
} from "@force-dev/utils";

import { ITokenService } from "~@service";

import { ApiError } from "./Api.types";

const env = import.meta.env;
const isDev = env.MODE === "development";

const DEV_BASE_URL = `${env.VITE_PROTOCOL}://${env.VITE_HOST}:${env.VITE_PORT}`;

export const BASE_URL = isDev ? DEV_BASE_URL : env.VITE_BASE_URL;
export const SOCKET_BASE_URL = env.VITE_SOCKET_BASE_URL;

export interface IApiService extends IIIApiService<ApiError, ApiError> {}

export const IApiService = iocDecorator<ApiService1>();

@IApiService({ inSingleton: true })
class ApiService1 extends ApiService<ApiError, ApiError> {
  constructor() {
    super(
      {
        timeout: 2 * 60 * 1000,
        withCredentials: true,
        baseURL: BASE_URL,
      },
      error =>
        new ApiError(
          error.response?.data.name ?? error.name,
          error.response?.data.message ?? error.message,
          error.status ?? 400,
          error.response?.data.reason ?? error.cause,
        ),
    );

    this.instance.interceptors.request.use(async request => {
      const headers = request.headers;
      const token = ITokenService.getInstance().accessToken;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return request;
    });
  }
}

const apiService = IApiService.getInstance();

export const axiosInstance = apiService.instance;
export type IAxiosInstance = typeof axiosInstance;
export const IAxiosInstance =
  iocDecorator<IAxiosInstance>().toConstantValue(axiosInstance);
