import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useApi } from "~@api";

import { Route } from "../../../routes/reset-password";
import {
  resetPasswordValidationSchema,
  TResetPasswordForm,
} from "../validations";

export const useResetPassword = () => {
  const api = useApi();
  const navigate = useNavigate();
  const { token } = Route.useSearch();

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
        const res = await api.resetPassword({
          password: data.password,
          token,
        });

        if (res.error) {
          console.error(res.error.message);
        } else if (res.data) {
          console.log(res.data.message);
          navigate({ to: "/auth/signIn" }).then();
        }
      }
    })();
  }, [form, navigate, api, token]);

  return { form, handleSubmit };
};
