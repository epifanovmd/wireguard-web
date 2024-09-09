import { ApiResponse, CancelablePromise, iocDecorator } from "@force-dev/utils";

export const IProfileService = iocDecorator<IProfileService>();

export interface IProfileService {
  getProfile(): CancelablePromise<ApiResponse<IProfile>>;
  updateProfile(
    params: IUpdateProfileRequest,
  ): CancelablePromise<ApiResponse<IProfile>>;
  signIn(
    credentials: ISignInRequest,
  ): CancelablePromise<ApiResponse<ISignInResponse>>;
  signUp(body: ISignUpRequest): CancelablePromise<ApiResponse<ISignUpResponse>>;

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
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;

  createdAt: string;
  updatedAt: string;
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
