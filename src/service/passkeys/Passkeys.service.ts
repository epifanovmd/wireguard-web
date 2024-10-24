import {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/types";

import { IApiService } from "~@api";

import {
  IPasskeysService,
  IVerifyAuthenticationRequest,
  IVerifyAuthenticationResponse,
  IVerifyRegistrationRequest,
  IVerifyRegistrationResponse,
} from "./Passkeys.types";

@IPasskeysService()
export class PasskeysService implements IPasskeysService {
  constructor(@IApiService() private _apiService: IApiService) {}

  generateRegistrationOptions = (profileId: string) => {
    return this._apiService.post<PublicKeyCredentialCreationOptionsJSON>(
      "/api/passkeys/generate-registration-options",
      { profileId },
    );
  };

  verifyRegistration = (reg: IVerifyRegistrationRequest) => {
    return this._apiService.post<
      IVerifyRegistrationResponse,
      IVerifyRegistrationRequest
    >("/api/passkeys/verify-registration", reg);
  };

  generateAuthenticationOptions = (profileId: string) => {
    return this._apiService.post<PublicKeyCredentialRequestOptionsJSON>(
      "/api/passkeys/generate-authentication-options",
      {
        profileId,
      },
    );
  };

  verifyAuthentication = (req: IVerifyAuthenticationRequest) => {
    return this._apiService.post<
      IVerifyAuthenticationResponse,
      IVerifyAuthenticationRequest
    >("/api/passkeys/verify-authentication", req);
  };
}
