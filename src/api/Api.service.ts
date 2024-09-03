import {
  ApiService,
  IApiService as IIIApiService,
  iocDecorator,
} from "@force-dev/utils";

import { ITokenService } from "~@service";

const env = import.meta.env;
const isDev = env.MODE === "development";

const DEV_BASE_URL = `${env.VITE_DEV_PROTOCOL}://${env.VITE_DEV_HOST}:${env.VITE_DEV_PORT}`;

export const BASE_URL = isDev ? DEV_BASE_URL : env.VITE_BASE_URL;
export const SOCKET_BASE_URL = env.VITE_SOCKET_BASE_URL;

export interface IApiService extends IIIApiService {}

export const IApiService = iocDecorator<ApiService1>();

@IApiService({ inSingleton: true })
class ApiService1 extends ApiService {
  constructor() {
    super({
      timeout: 2 * 60 * 1000,
      withCredentials: true,
      baseURL: BASE_URL,
    });

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

apiService.onResponse(response => {
  console.log("response", response);
});

export const axiosInstance = apiService.instance;
export type IAxiosInstance = typeof axiosInstance;
export const IAxiosInstance =
  iocDecorator<IAxiosInstance>().toConstantValue(axiosInstance);
