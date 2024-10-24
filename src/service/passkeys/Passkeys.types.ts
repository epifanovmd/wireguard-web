import { ApiResponse, CancelablePromise, iocDecorator } from "@force-dev/utils";
import {
  AuthenticationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/types";

import { ApiError } from "~@api";

import { ITokensDto } from "../../api/api-gen/data-contracts";

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
  tokens?: ITokensDto;
}

export interface IVerifyRegistrationResponse {
  verified: boolean;
}

export const IPasskeysService = iocDecorator<IPasskeysService>();

export interface IPasskeysService {
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
