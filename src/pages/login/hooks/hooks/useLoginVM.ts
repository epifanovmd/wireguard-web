import { ChangeEvent, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useTextInput } from "../../../../common/forms";
import { RoutePaths } from "../../../../routes";
import { useAuthDataStore } from "../../../../store";

export const useLoginVM = () => {
  const authDataStore = useAuthDataStore();
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
      await authDataStore.login({
        username: username.value,
        password: password.value,
      });

      if (authDataStore.data) {
        navigate(RoutePaths.ROOT);
      }
    }
  }, [authDataStore, navigate, password.value, username.value]);

  return {
    handleLogin,
    username,
    password,
    handleChangeLogin,
    handleChangePassword,
  };
};
