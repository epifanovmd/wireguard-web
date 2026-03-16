import { createServiceDecorator, SupportInitialize } from "@force-dev/utils";

import {
  ISignInRequestDto,
  TSignUpRequestDto,
} from "~@api/api-gen/data-contracts";

export const ISessionDataStore = createServiceDecorator<ISessionDataStore>();

export interface ISessionDataStore extends SupportInitialize {
  isLoading: boolean;
  isAuthorized: boolean;
  isReady: boolean;
  lastError: string | null;

  signIn(params: ISignInRequestDto): Promise<void>;
  signUp(params: TSignUpRequestDto): Promise<void>;
  restore(tokens?: { accessToken: string; refreshToken: string }): Promise<void>;
  clear(): void;
}
