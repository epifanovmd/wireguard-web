import {
  ApiResponse,
  CancelablePromise,
  createServiceDecorator,
} from "@force-dev/utils";
import {
  AuthenticationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/types";

import { ApiError } from "~@api";

import { IRefreshTokenResponse } from "../profile";

export interface IVerifyRegistrationRequest {
  profileId: string;
  data: RegistrationResponseJSON;
}

export interface IVerifyAuthenticationRequest {
  profileId: string;
  data: AuthenticationResponseJSON;
}

export interface IVerifyAuthenticationResponse {
  verified: boolean;
  tokens?: IRefreshTokenResponse;
}

export interface IVerifyRegistrationResponse {
  verified: boolean;
}

export const IPasskeysService = createServiceDecorator<IPasskeysService>();

export interface IPasskeysService {
  profileId: string | null;

  handleRegister(profileId: string): Promise<boolean>;

  handleLogin(): Promise<IVerifyAuthenticationResponse | undefined>;

  generateRegistrationOptions(
    profileId: string,
  ): CancelablePromise<
    ApiResponse<PublicKeyCredentialCreationOptionsJSON, ApiError>
  >;

  verifyRegistration(
    req: IVerifyRegistrationRequest,
  ): CancelablePromise<ApiResponse<IVerifyRegistrationResponse, ApiError>>;

  generateAuthenticationOptions(
    profileId: string,
  ): CancelablePromise<
    ApiResponse<PublicKeyCredentialRequestOptionsJSON, ApiError>
  >;

  verifyAuthentication(
    reg: IVerifyAuthenticationRequest,
  ): CancelablePromise<ApiResponse<IVerifyAuthenticationResponse, ApiError>>;
}
