import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { notification } from "antd";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { useProfileDataStore } from "~@store";

import { signUpFormValidationSchema, TSignUpForm } from "../validations";

export const useSignUpVM = () => {
  const profileDataStore = useProfileDataStore();
  const navigate = useNavigate();

  const form = useForm<TSignUpForm>({
    defaultValues: {},
    resolver: zodResolver(signUpFormValidationSchema),
  });

  const handleSignUp = useCallback(async () => {
    return form.handleSubmit(async data => {
      await profileDataStore.signUp(data);

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
    handleSignUp,
  };
};
