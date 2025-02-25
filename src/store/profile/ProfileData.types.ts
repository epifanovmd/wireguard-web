import { createServiceDecorator, DataHolder } from "@force-dev/utils";

import {
  IProfile,
  IRefreshTokenResponse,
  ISignInRequest,
  ISignUpRequest,
} from "~@service";

export const IProfileDataStore = createServiceDecorator<IProfileDataStore>();

export interface IProfileDataStore {
  holder: DataHolder<IProfile>;
  profile?: IProfile;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  isAdmin: boolean;

  getProfile(): Promise<IProfile | undefined>;

  updateToken(): Promise<IRefreshTokenResponse>;

  signIn(params: ISignInRequest): Promise<void>;

  signUp(params: ISignUpRequest): Promise<void>;
}
