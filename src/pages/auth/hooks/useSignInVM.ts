import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { notification } from "antd";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { useProfileDataStore } from "~@store";

import { signInFormValidationSchema, TSignInForm } from "../validations";

export const useSignInVM = () => {
  const profileDataStore = useProfileDataStore();
  const navigate = useNavigate();

  const form = useForm<TSignInForm>({
    defaultValues: {
      login: "",
      password: "",
    },
    resolver: zodResolver(signInFormValidationSchema),
  });

  const handleNavigateSignUp = useCallback(() => {
    return navigate({ to: "/auth/signUp" });
  }, [navigate]);

  const handleNavigateRecoveryPassword = useCallback(() => {
    return navigate({ to: "/auth/recovery-password" });
  }, [navigate]);

  const handleLogin = useCallback(async () => {
    return form.handleSubmit(async data => {
      await profileDataStore.signIn(data);

      if (profileDataStore.isError) {
        notification.error({ message: profileDataStore.holder.error?.msg });
      }

      if (profileDataStore.profile) {
        navigate({ to: "/" }).then();
      }
    })();
  }, [form, navigate, profileDataStore]);

  return {
    form,
    handleLogin,
    handleNavigateRecoveryPassword,
    handleNavigateSignUp,
  };
};
