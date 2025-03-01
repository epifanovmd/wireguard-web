import { browserSupportsWebAuthn } from "@simplewebauthn/browser";
import { useNavigate } from "@tanstack/react-router";
import { notification } from "antd";
import { useCallback, useEffect, useState } from "react";

import { usePasskeysService } from "~@service";
import { useSessionDataStore } from "~@store";

export const usePasskeyAuth = () => {
  const [support, setSupport] = useState<boolean>(false);
  const {
    profileId,
    handleRegister: _handleRegister,
    handleLogin: _handleLogin,
  } = usePasskeysService();
  const { restore } = useSessionDataStore();
  const navigate = useNavigate();

  useEffect(() => {
    const support = browserSupportsWebAuthn();

    setSupport(support);
  }, []);

  const handleRegister = useCallback(
    async (profileId: string) => {
      try {
        return await _handleRegister(profileId);
      } catch (error: any) {
        notification.error({ message: error.message });
      }

      return false;
    },
    [_handleRegister],
  );

  const handleLogin = useCallback(async () => {
    try {
      const response = await _handleLogin();

      if (response) {
        await restore(response.tokens);
        navigate({ to: "/" }).then();
      }
    } catch (error: any) {
      notification.error({ message: error.message });
    }
  }, [_handleLogin, navigate, restore]);

  return { profileId, handleRegister, handleLogin, support };
};
