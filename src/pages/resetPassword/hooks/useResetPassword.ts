import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { notification } from "antd";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useProfileService } from "~@service";

import { Route } from "../../../routes/reset-password.lazy";
import {
  resetPasswordValidationSchema,
  TResetPasswordForm,
} from "../validations";

export const useResetPassword = () => {
  const profileService = useProfileService();
  const navigate = useNavigate();
  const { token } = Route.useSearch<{ token?: string }>();

  useEffect(() => {
    if (!token) {
      navigate({ to: "/auth/signIn" }).then();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("token", token);

  const form = useForm<TResetPasswordForm>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(resetPasswordValidationSchema),
  });

  const handleSubmit = useCallback(() => {
    return form.handleSubmit(async data => {
      if (token) {
        const res = await profileService.resetPassword({
          password: data.password,
          token,
        });

        if (res.error) {
          notification.error({ message: res.error.message });
        } else if (res.data) {
          notification.success({ message: res.data.message });
          navigate({ to: "/auth/signIn" }).then();
        }
      }
    })();
  }, [form, navigate, profileService, token]);

  return { form, handleSubmit };
};
