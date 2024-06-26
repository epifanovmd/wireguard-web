import { ApiAbortPromise, ApiResponse } from "@api";
import { iocDecorator } from "@force-dev/utils";

export const IProfileService = iocDecorator<IProfileService>();

export interface IProfileService {
  signIn(
    credentials: ISignInRequest,
  ): ApiAbortPromise<ApiResponse<ISignInResponse>>;

  refresh(
    body: IRefreshTokenRequest,
  ): ApiAbortPromise<ApiResponse<IRefreshTokenResponse>>;
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IProfile {
  id: string;
  login: string;
  name: string;
}

export interface ISignInRequest {
  username: string;
  password: string;
}

export interface ISignInResponse extends IProfile {
  tokens: IRefreshTokenResponse;
}

export interface ISignUpRequest extends ISignInRequest {
  name: string;
}

export interface ISignUpResponse extends IProfile {
  tokens: IRefreshTokenResponse;
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}
