import { useTextInput } from "@force-dev/react";
import { useProfileDataStore } from "@store";
import { ChangeEvent, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { RoutePaths } from "../../../routes";

export const useLoginVM = () => {
  const profileDataStore = useProfileDataStore();
  const navigate = useNavigate();

  const username = useTextInput({
    initialValue: "string",
    validate: value => {
      const res = z.string().min(1).safeParse(value);

      console.log("res", res);

      // if (res.error) {
      //   return res.error.errors[0].message;
      // }

      return "";
    },
  });
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
