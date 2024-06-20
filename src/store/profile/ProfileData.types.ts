import { DataHolder, iocDecorator } from "@force-dev/utils";

import { IProfile, IRefreshTokenResponse, ISignInRequest } from "../../service";

export const IProfileDataStore = iocDecorator<IProfileDataStore>();

export interface IProfileDataStore {
  holder: DataHolder<IProfile>;
  profile?: IProfile;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;

  restoreRefreshToken(): Promise<IRefreshTokenResponse>;

  refresh(refreshToken: string): Promise<void>;

  signIn(params: ISignInRequest): Promise<void>;

  // signUp(params: ISignUpRequest): void;
}
