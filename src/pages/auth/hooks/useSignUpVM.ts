import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { isEmail, isPhone } from "~@common";
import { useSessionDataStore } from "~@store";

import { signUpFormValidationSchema, TSignUpForm } from "../validations";

export const useSignUpVM = () => {
  const sessionDataStore = useSessionDataStore();
  const navigate = useNavigate();

  const form = useForm<TSignUpForm>({
    defaultValues: {},
    resolver: zodResolver(signUpFormValidationSchema),
  });

  const handleSignUp = useCallback(async () => {
    return form.handleSubmit(async data => {
      const email = isEmail(data.login) ? data.login : undefined;
      const phone = isPhone(data.login) ? data.login : undefined;

      if (email) {
        await sessionDataStore.signUp({
          email,
          password: data.password,
        });
      } else if (phone) {
        await sessionDataStore.signUp({
          phone,
          password: data.password,
        });
      }

      if (sessionDataStore.isAuthorized) {
        navigate({ to: "/" }).then();
      }
    })();
  }, [form, navigate, sessionDataStore]);

  return {
    form,
    handleSignUp,
  };
};
