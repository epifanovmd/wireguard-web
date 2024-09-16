export type ApiRequest<T extends object = {}> = T & {
  skip?: number;
  limit?: number;
};

export interface ListResponse<T> {
  count?: number;
  offset?: number;
  limit?: number;
  data: T;
}

export type HttpExceptionReason =
  | string
  | Record<string, unknown>
  | Error
  | undefined;

export class ApiError extends Error {
  public readonly status: number;
  public readonly reason?: HttpExceptionReason;

  constructor(
    name: string,
    message: string,
    status: number,
    reason?: HttpExceptionReason,
  ) {
    super();

    this.name = name;
    this.message = message;
    this.status = status;
    this.reason = reason;
  }
}
