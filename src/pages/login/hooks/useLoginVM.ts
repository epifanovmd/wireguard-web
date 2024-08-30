import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { useProfileDataStore } from "~@store";

import { loginFormValidation, TLoginForm } from "../validations";

export const useLoginVM = () => {
  const profileDataStore = useProfileDataStore();
  const navigate = useNavigate();

  const form = useForm<TLoginForm>({
    defaultValues: {
      username: "string",
      password: "string",
    },
    resolver: zodResolver(loginFormValidation),
  });

  const handleLogin = useCallback(async () => {
    return form.handleSubmit(async data => {
      await profileDataStore.signIn(data);

      if (profileDataStore.profile) {
        console.log("profileDataStore.profile", profileDataStore.profile);
        navigate({ to: "/" }).then();
      }
    })();
  }, [form, navigate, profileDataStore]);

  return {
    form,
    handleLogin,
  };
};
