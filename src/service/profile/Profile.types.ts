import { ApiResponse, CancelablePromise, iocDecorator } from "@force-dev/utils";

import { ApiError } from "~@api";

export const IProfileService = iocDecorator<IProfileService>();

export interface IProfileService {
  getProfile(): CancelablePromise<ApiResponse<IProfile, ApiError>>;

  updateProfile(
    params: IUpdateProfileRequest,
  ): CancelablePromise<ApiResponse<IProfile, ApiError>>;

  signIn(
    credentials: ISignInRequest,
  ): CancelablePromise<ApiResponse<ISignInResponse, ApiError>>;

  signUp(
    body: ISignUpRequest,
  ): CancelablePromise<ApiResponse<ISignUpResponse, ApiError>>;

  refresh(
    body: IRefreshTokenRequest,
  ): CancelablePromise<ApiResponse<IRefreshTokenResponse, ApiError>>;
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export enum ERole {
  ADMIN = "admin",
  USER = "user",
  GUEST = "guest",
}

export enum EPermissions {
  READ = "read",
  WRITE = "write",
  DELETE = "delete",
}

export interface IProfile {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;

  createdAt: string;
  updatedAt: string;

  role: {
    id: string;
    name: ERole;
    permissions: {
      id: string;
      name: EPermissions;
    }[];
  };
}

export interface IUpdateProfileRequest
  extends Omit<ISignUpRequest, "password"> {}

export interface ISignInRequest {
  username: string;
  password: string;
}

export interface ISignInResponse extends IProfile {
  tokens: IRefreshTokenResponse;
}

export interface ISignUpRequest extends ISignInRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface ISignUpResponse extends IProfile {
  tokens: IRefreshTokenResponse;
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}
