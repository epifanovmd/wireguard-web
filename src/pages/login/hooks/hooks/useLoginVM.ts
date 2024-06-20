import { useTextInput } from "@force-dev/react";
import { ChangeEvent, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { RoutePaths } from "../../../../routes";
import { useProfileDataStore } from "../../../../store";

export const useLoginVM = () => {
  const profileDataStore = useProfileDataStore();
  const navigate = useNavigate();

  const username = useTextInput({ initialValue: "string" });
  const password = useTextInput({ initialValue: "string" });

  const handleChangeLogin = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      username.setValue(event.target.value);
    },
    [username],
  );

  const handleChangePassword = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      password.setValue(event.target.value);
    },
    [password],
  );

  const handleLogin = useCallback(async () => {
    if (username.value && password.value) {
      await profileDataStore.signIn({
        username: username.value,
        password: password.value,
      });

      if (profileDataStore.profile) {
        navigate(RoutePaths.ROOT);
      }
    }
  }, [navigate, password.value, profileDataStore, username.value]);

  return {
    handleLogin,
    username,
    password,
    handleChangeLogin,
    handleChangePassword,
  };
};
