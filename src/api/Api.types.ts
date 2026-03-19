import { createServiceDecorator } from "@force-dev/utils";

import { Api } from "./api-gen/Api";

export const IApiService = createServiceDecorator<IApiService>();
export interface IApiService extends Api<ApiError, ApiError> {
  updateToken(): Promise<void>;
  setTokens(accessToken: string, refreshToken: string): void;
  clearTokens(): void;
  restoreTokens(): Promise<boolean>;
}

export class ApiError extends Error {
  constructor(
    public readonly name: string,
    public readonly message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = name;
  }

  static fromAxiosError(error: any): ApiError {
    return new ApiError(
      error.response?.data.name ?? error.name,
      error.response?.data.message ?? error.message ?? "Request failed",
      error.status ?? 400,
      error.response?.data.reason ?? error.cause,
    );
  }

  get isUnauthorized() {
    return this.status === 401;
  }
  get isForbidden() {
    return this.status === 403;
  }
  get isNotFound() {
    return this.status === 404;
  }
  get isServerError() {
    return this.status >= 500;
  }
  get isNetworkError() {
    return this.status === 0;
  }
}
