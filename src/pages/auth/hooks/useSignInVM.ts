import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { useProfileDataStore } from "~@store";

import { signInFormValidation, TSignInForm } from "../validations";

export const useSignInVM = () => {
  const profileDataStore = useProfileDataStore();
  const navigate = useNavigate();

  const form = useForm<TSignInForm>({
    defaultValues: {
      login: "",
      password: "",
    },
    resolver: zodResolver(signInFormValidation),
  });

  const handleNavigateSignUp = useCallback(() => {
    return navigate({ to: "/auth/signUp" });
  }, [navigate]);

  const handleLogin = useCallback(async () => {
    return form.handleSubmit(async data => {
      await profileDataStore.signIn(data);

      if (profileDataStore.profile) {
        navigate({ to: "/" }).then();
      }
    })();
  }, [form, navigate, profileDataStore]);

  return {
    form,
    handleLogin,
    handleNavigateSignUp,
  };
};
