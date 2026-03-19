import { createServiceDecorator } from "@force-dev/utils";
import type { AxiosError } from "axios";

import { Api } from "./api-gen/Api";

export const IApiService = createServiceDecorator<IApiService>();
export type IApiService = Api<ApiError, ApiError>;

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

type ApiErrorBody = {
  name?: string;
  message?: string;
  reason?: string;
};

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

  static fromAxiosError(error: AxiosError<ApiErrorBody>): ApiError {
    const body = error.response?.data;

    return new ApiError(
      body?.name ?? error.name,
      body?.message ?? error.message ?? "Request failed",
      error.response?.status ?? 0,
      body?.reason ?? String(error.cause ?? ""),
      body,
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
