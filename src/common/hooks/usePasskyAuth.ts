import {
  browserSupportsWebAuthn,
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/types";
import { useNavigate } from "@tanstack/react-router";
import { notification } from "antd";
import { useCallback, useEffect, useState } from "react";

import { useApi } from "~@api";
import {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from "~@api/api-gen/data-contracts";
import { useSessionDataStore } from "~@store";

export const usePasskeyAuth = () => {
  const [support, setSupport] = useState<boolean>(false);
  // Сохраненный userId в localStorage, означает что доступен вход по биометрии
  const [profileId, setProfileId] = useState(localStorage.getItem("profileId"));

  const api = useApi();
  const { restore } = useSessionDataStore();
  const navigate = useNavigate();

  useEffect(() => {
    const support = browserSupportsWebAuthn();

    setSupport(support);
  }, []);

  const handleRegister = useCallback(
    async (profileId: string) => {
      // Получите challenge и другие данные с сервера
      const response = await api.generateRegistrationOptions({ profileId });

      console.log("response", response);

      if (response.error) {
        notification.error({ message: response.error.message });
      } else if (response.data) {
        // Запустите процесс регистрации
        return await startRegistration({
          optionsJSON: response.data as PublicKeyCredentialCreationOptionsJSON,
        })
          .then(async data => {
            const isVerified = await api
              .verifyRegistration({
                profileId,
                data: data as RegistrationResponseJSON,
              })
              .then(res => !!res.data?.verified)
              .catch(
                err =>
                  err.message === "The authenticator was previously registered",
              );

            if (isVerified) {
              localStorage.setItem("profileId", profileId);
              setProfileId(profileId);
            }

            return isVerified;
          })
          .catch(err => {
            console.log("[usePasskeyAuth:handleRegister] error", err);
            if (err.message === "The authenticator was previously registered") {
              localStorage.setItem("profileId", profileId);
              setProfileId(profileId);
            }

            return false;
          });
      }

      return false;
    },
    [api],
  );

  const handleLogin = useCallback(async () => {
    if (!profileId) {
      return;
    }

    const response = await api.generateAuthenticationOptions({ profileId });

    if (response.data) {
      // Запустите процесс аутентификации
      const data = await startAuthentication({ optionsJSON: response.data });
      const verifyResponse = await api.verifyAuthentication({
        profileId,
        data: data as AuthenticationResponseJSON,
      });

      if (verifyResponse.error) {
        notification.error({ message: verifyResponse.error.message });
      } else if (verifyResponse.data) {
        await restore(verifyResponse.data.tokens);
        navigate({ to: "/" }).then();
      }
    }
  }, [api, navigate, profileId, restore]);

  return { profileId, handleRegister, handleLogin, support };
};
