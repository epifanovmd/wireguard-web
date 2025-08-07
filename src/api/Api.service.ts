import { ApiError, IApiService } from "./Api.types";
import { Api } from "./api-gen/Api";
import { IApiTokenProvider } from "./ApiToken.provider";

const env = import.meta.env;
const isDev = env.MODE === "development";

const DEV_BASE_URL = `${env.VITE_PROTOCOL}://${env.VITE_HOST}:${env.VITE_PORT}`;

export const BASE_URL = isDev ? DEV_BASE_URL : env.VITE_BASE_URL;
export const SOCKET_BASE_URL = env.VITE_SOCKET_BASE_URL;

@IApiService({ inSingleton: true })
class ApiService extends Api<ApiError, ApiError> {
  constructor(@IApiTokenProvider() private _tokenProvider: IApiTokenProvider) {
    super(
      {
        timeout: 2 * 60 * 1000,
        withCredentials: true,
        baseURL: BASE_URL,
      },
      error => {
        const err = new ApiError(
          error.response?.data.name ?? error.name,
          error.response?.data.message ?? error.message,
          error.status ?? 400,
          error.response?.data.reason ?? error.cause,
        );

        if (err.status === 401 && this._tokenProvider.accessToken) {
          this._tokenProvider.clear();
        }

        if (err.status === 403) {
          this.updateToken().then();
        }

        return err;
      },
    );

    this.instance.interceptors.request.use(async request => {
      const headers = request.headers;
      const token = this._tokenProvider.accessToken;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return request;
    });
  }

  public async updateToken() {
    const res = await this.refresh({
      refreshToken: this._tokenProvider.refreshToken,
    });

    if (res.data) {
      this._tokenProvider.setTokens(
        res.data.accessToken,
        res.data.refreshToken,
      );
    } else {
      this._tokenProvider.clear();
    }
  }
}
