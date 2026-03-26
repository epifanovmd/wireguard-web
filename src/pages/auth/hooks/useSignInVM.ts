import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { signInFormValidationSchema, TSignInForm } from "../validations";

export const useSignInVM = () => {
  const authStore = useAuthStore();
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
      await authStore.signIn(data);

      if (authStore.isAuthenticated) {
        navigate({ to: "/" }).then();
      }
    })();
  }, [form, navigate, authStore]);

  return {
    form,
    handleLogin,
    handleNavigateRecoveryPassword,
    handleNavigateSignUp,
  };
};
