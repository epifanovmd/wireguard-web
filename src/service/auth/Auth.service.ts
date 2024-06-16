import Cookie from "js-cookie";

import { apiService } from "../../api";
import { IAuthService, ILoginRequest, IProfile } from "./Auth.types";

@IAuthService()
export class AuthService implements IAuthService {
  login(credentials: ILoginRequest) {
    return apiService.post<IProfile, ILoginRequest>(
      "/api/auth/signIn",
      credentials,
    );
  }

  getLocalAccessToken() {
    return Cookie.get("access_token") ?? "";
  }
}
