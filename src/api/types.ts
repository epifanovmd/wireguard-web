import { AxiosRequestConfig } from "axios";

export interface ApiResponse<R> {
  data?: R;
  error?: ApiError;
}

export type ApiRequest<T extends object = {}> = T & {
  search?: string;
  page?: number;
  limit?: number;
  sortField?: string;
  sort?: "asc" | "dsc";
};

export interface ApiRequestConfig extends AxiosRequestConfig {
  useRaceCondition?: boolean;
}

export class ApiError extends Error {
  public status: number;
  public type: ErrorType | undefined;

  constructor(
    status: number,
    type?: ErrorType,
    message: string = "Ошибка на стороне сервера",
  ) {
    super(message);
    this.status = status;
    this.type = type;
  }
}

export enum ErrorType {
  RouteNotFoundException = "RouteNotFoundException",
  DataBaseErrorException = "DataBaseErrorException",
  ProfileNotFoundException = "ProfileNotFoundException",
  UnauthorizedException = "UnauthorizedException",
  ValidateException = "ValidateException",
  AccessRestrictedException = "AccessRestrictedException",
  ServerErrorException = "ServerErrorException",
}
