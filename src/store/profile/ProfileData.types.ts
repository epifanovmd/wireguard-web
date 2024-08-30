import { DataHolder, iocDecorator } from "@force-dev/utils";

import { IProfile, IRefreshTokenResponse, ISignInRequest } from "~@service";

export const IProfileDataStore = iocDecorator<IProfileDataStore>();

export interface IProfileDataStore {
  holder: DataHolder<IProfile>;
  profile?: IProfile;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;

  updateToken(): Promise<IRefreshTokenResponse>;

  signIn(params: ISignInRequest): Promise<void>;

  // signUp(params: ISignUpRequest): void;
}
