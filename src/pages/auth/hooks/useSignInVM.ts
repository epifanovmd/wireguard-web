import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { useSessionDataStore } from "~@store";

import { signInFormValidationSchema, TSignInForm } from "../validations";

export const useSignInVM = () => {
  const sessionDataStore = useSessionDataStore();
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
      await sessionDataStore.signIn(data);

      if (sessionDataStore.isAuthorized) {
        navigate({ to: "/" }).then();
      }
    })();
  }, [form, navigate, sessionDataStore]);

  return {
    form,
    handleLogin,
    handleNavigateRecoveryPassword,
    handleNavigateSignUp,
  };
};
