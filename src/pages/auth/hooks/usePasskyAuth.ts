import {
  browserSupportsWebAuthn,
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { usePasskeysService } from "~@service";
import { useSessionDataStore } from "~@store";

export const usePasskeyAuth = () => {
  const [support, setSupport] = useState<boolean>(false);
  const {
    generateRegistrationOptions,
    verifyRegistration,
    generateAuthenticationOptions,
    verifyAuthentication,
  } = usePasskeysService();
  const { restore } = useSessionDataStore();
  const navigate = useNavigate();

  useEffect(() => {
    setSupport(browserSupportsWebAuthn());
  }, []);

  const handleRegister = useCallback(
    async (profileId: string) => {
      localStorage.setItem("profileId", profileId);
      try {
        // Получите challenge и другие данные с сервера
        const response = await generateRegistrationOptions(profileId);

        if (response.data) {
          // Запустите процесс регистрации
          const data = await startRegistration({ optionsJSON: response.data });
          // Отправьте результат обратно на сервер

          const verifyResponse = await verifyRegistration({
            profileId,
            data,
          });

          return !!verifyResponse.data?.verified;
        }
      } catch (error) {
        console.log("error", error);
        //
      }

      return false;
    },
    [generateRegistrationOptions, verifyRegistration],
  );

  const handleLogin = useCallback(async () => {
    try {
      const profileId = localStorage.getItem("profileId");

      if (!profileId) {
        return;
      }

      // Получите challenge и другие данные с сервера
      const response = await generateAuthenticationOptions(profileId);

      if (response.data) {
        // Запустите процесс аутентификации
        const data = await startAuthentication({ optionsJSON: response.data });
        const verifyResponse = await verifyAuthentication({
          profileId,
          data,
        });

        if (verifyResponse.data) {
          await restore(verifyResponse.data.tokens);
          navigate({ to: "/" }).then();
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  }, [generateAuthenticationOptions, navigate, restore, verifyAuthentication]);

  return { handleRegister, handleLogin, support };
};
