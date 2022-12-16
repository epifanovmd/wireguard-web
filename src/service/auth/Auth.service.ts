import { injectable } from "inversify";
import Cookie from "js-cookie";

import { apiService } from "../../api";
import { ILoginRequest, IProfile } from "./Auth.types";

@injectable()
export class AuthService {
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
