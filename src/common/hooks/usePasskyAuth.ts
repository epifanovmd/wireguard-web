import {
  browserSupportsWebAuthn,
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/types";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { useApi } from "~@api";
import {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from "~@api/api-gen/data-contracts";
import { useSessionDataStore } from "~@store";

const PROFILE_ID_KEY = "profileId";

export const usePasskeyAuth = () => {
  const [support, setSupport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(
    () => localStorage.getItem(PROFILE_ID_KEY),
  );

  const api = useApi();
  const { restore } = useSessionDataStore();
  const navigate = useNavigate();

  useEffect(() => {
    setSupport(browserSupportsWebAuthn());
  }, []);

  const handleRegister = useCallback(
    async (login: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const optionsRes = await api.generateRegistrationOptions();

        if (optionsRes.error) {
          setError(optionsRes.error.message);
          return false;
        }

        let attResp;

        try {
          attResp = await startRegistration({
            optionsJSON:
              optionsRes.data as PublicKeyCredentialCreationOptionsJSON,
          });
        } catch (err: any) {
          if (err?.name === "InvalidStateError") {
            // Аутентификатор уже зарегистрирован — считаем успехом
            localStorage.setItem(PROFILE_ID_KEY, login);
            setProfileId(login);
            return true;
          }

          setError(err?.message ?? "Registration cancelled");

          return false;
        }

        const verifyRes = await api.verifyRegistration({
          data: attResp as RegistrationResponseJSON,
        });

        if (verifyRes.error) {
          setError(verifyRes.error.message);
          return false;
        }

        if (verifyRes.data?.verified) {
          localStorage.setItem(PROFILE_ID_KEY, login);
          setProfileId(login);
          return true;
        }

        setError("Passkey registration was not verified by the server");

        return false;
      } catch (err: any) {
        setError(err?.message ?? "Passkey registration failed");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  const handleLogin = useCallback(async (): Promise<boolean> => {
    if (!profileId) {
      setError("No passkey registered on this device");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const optionsRes = await api.generateAuthenticationOptions({
        login: profileId,
      });

      if (optionsRes.error) {
        setError(optionsRes.error.message);
        return false;
      }

      let authResp;

      try {
        authResp = await startAuthentication({
          optionsJSON: optionsRes.data!,
        });
      } catch (err: any) {
        setError(err?.message ?? "Authentication cancelled");
        return false;
      }

      const verifyRes = await api.verifyAuthentication({
        data: authResp as AuthenticationResponseJSON,
      });

      if (verifyRes.error) {
        setError(verifyRes.error.message);
        return false;
      }

      if (verifyRes.data?.tokens) {
        await restore(verifyRes.data.tokens);
        navigate({ to: "/" });
        return true;
      }

      setError("Authentication was not verified by the server");

      return false;
    } catch (err: any) {
      setError(err?.message ?? "Passkey authentication failed");
      return false;
    } finally {
      setLoading(false);
    }
  }, [api, navigate, profileId, restore]);

  const removePasskey = useCallback(() => {
    localStorage.removeItem(PROFILE_ID_KEY);
    setProfileId(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    support,
    loading,
    error,
    profileId,
    handleRegister,
    handleLogin,
    removePasskey,
    clearError,
  };
};
