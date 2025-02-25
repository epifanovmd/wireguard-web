import { createServiceDecorator } from "@force-dev/utils";

import { ITokenService } from "~@service/token";

import { ApiError } from "./Api.types";
import { Api } from "./api-gen/Api";

const env = import.meta.env;
const isDev = env.MODE === "development";

const DEV_BASE_URL = `${env.VITE_PROTOCOL}://${env.VITE_HOST}:${env.VITE_PORT}`;

export const BASE_URL = isDev ? DEV_BASE_URL : env.VITE_BASE_URL;
export const SOCKET_BASE_URL = env.VITE_SOCKET_BASE_URL;

export interface IApiService extends Api<ApiError, ApiError> {}

export const IApiService = createServiceDecorator<ApiService>();

@IApiService({ inSingleton: true })
class ApiService extends Api<ApiError, ApiError> {
  constructor(@ITokenService() private _tokenService: ITokenService) {
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
      const token = this._tokenService.accessToken;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return request;
    });
  }
}
