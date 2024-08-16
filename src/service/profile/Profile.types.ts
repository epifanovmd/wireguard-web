import { ApiResponse, CancelablePromise, iocDecorator } from "@force-dev/utils";

export const IProfileService = iocDecorator<IProfileService>();

export interface IProfileService {
  signIn(
    credentials: ISignInRequest,
  ): CancelablePromise<ApiResponse<ISignInResponse>>;

  refresh(
    body: IRefreshTokenRequest,
  ): CancelablePromise<ApiResponse<IRefreshTokenResponse>>;
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
