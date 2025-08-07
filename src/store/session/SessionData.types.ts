import { createServiceDecorator, SupportInitialize } from "@force-dev/utils";

import {
  ISignInRequest,
  ISignUpRequest,
  ITokensDto,
} from "~@api/api-gen/data-contracts";

export const ISessionDataStore = createServiceDecorator<ISessionDataStore>();

export interface ISessionDataStore extends SupportInitialize {
  isLoading: boolean;
  isAuthorized: boolean;

  signIn(params: ISignInRequest): Promise<void>;
  signUp(params: ISignUpRequest): Promise<void>;
  restore(tokens?: ITokensDto): Promise<void>;
  clear(): void;
}
