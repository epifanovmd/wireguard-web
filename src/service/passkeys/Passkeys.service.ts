import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
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

  get profileId() {
    // Сохраненный profileId в localStorage, означает что доступен вход по биометрии
    return localStorage.getItem("profileId");
  }

  handleRegister = async (profileId: string) => {
    localStorage.setItem("profileId", profileId);

    // Получите challenge и другие данные с сервера
    const response = await this.generateRegistrationOptions(profileId);

    if (response.data) {
      // Запустите процесс регистрации
      const data = await startRegistration({ optionsJSON: response.data });
      // Отправьте результат обратно на сервер

      const verifyResponse = await this.verifyRegistration({
        profileId,
        data,
      });

      return !!verifyResponse.data?.verified;
    }

    return false;
  };

  handleLogin = async () => {
    if (!this.profileId) {
      return;
    }

    // Получите challenge и другие данные с сервера
    const response = await this.generateAuthenticationOptions(this.profileId);

    if (response.data) {
      // Запустите процесс аутентификации
      const data = await startAuthentication({ optionsJSON: response.data });
      const verifyResponse = await this.verifyAuthentication({
        profileId: this.profileId,
        data,
      });

      if (verifyResponse.data) {
        return verifyResponse.data;
      }
    }

    return undefined;
  };

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
