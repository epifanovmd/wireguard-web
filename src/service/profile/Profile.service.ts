import { IApiService } from "~@api";

import {
  IProfile,
  IProfileService,
  IRefreshTokenRequest,
  IRefreshTokenResponse,
  ISignInRequest,
  ISignInResponse,
  ISignUpRequest,
  ISignUpResponse,
  IUpdateProfileRequest,
} from "./Profile.types";

@IProfileService()
export class ProfileService implements IProfileService {
  constructor(@IApiService() private _apiService: IApiService) {}

  getProfile() {
    return this._apiService.get<IProfile>("api/profile/my");
  }

  updateProfile(params: IUpdateProfileRequest) {
    return this._apiService.put<IProfile, IUpdateProfileRequest>(
      "api/profile/my/update",
      params,
    );
  }

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
