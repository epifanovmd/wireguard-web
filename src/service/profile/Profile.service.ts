import { IApiService } from "~@api";

import {
  IProfileService,
  IRefreshTokenRequest,
  IRefreshTokenResponse,
  ISignInRequest,
  ISignInResponse,
  ISignUpRequest,
  ISignUpResponse,
} from "./Profile.types";

@IProfileService()
export class ProfileService implements IProfileService {
  constructor(@IApiService() private _apiService: IApiService) {}

  signIn(credentials: ISignInRequest) {
    return this._apiService.post<ISignInResponse, ISignInRequest>(
      "api/auth/signIn",
      credentials,
    );
  }

  signUp(body: ISignUpRequest) {
    return this._apiService.post<ISignUpResponse, ISignUpRequest>(
      "api/auth/signUp",
      body,
    );
  }

  refresh(body: IRefreshTokenRequest) {
    return this._apiService.post<IRefreshTokenResponse, IRefreshTokenRequest>(
      "api/auth/refresh",
      body,
    );
  }
}
