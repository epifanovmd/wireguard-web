import Cookie from "js-cookie";

import { ApiResponse, apiService } from "../../api";
import { iocDecorator } from "../../common";

export interface IProfile {
  id: string;
  login: string;
  name: string;
}

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface IRegistrationRequest extends ILoginRequest {
  name: string;
}

export const IAuthService = iocDecorator<IAuthService>();

export interface IAuthService {
  login(credentials: ILoginRequest): Promise<ApiResponse<IProfile>>;

  getLocalAccessToken(): string;
}
