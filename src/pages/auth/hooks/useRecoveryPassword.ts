import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { notification } from "antd";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { useApi } from "~@api";

import {
  recoveryPasswordValidationSchema,
  TRecoveryPasswordForm,
} from "../validations";

export const useRecoveryPassword = () => {
  const api = useApi();
  const navigate = useNavigate();

  const form = useForm<TRecoveryPasswordForm>({
    defaultValues: {
      login: "",
    },
    resolver: zodResolver(recoveryPasswordValidationSchema),
  });

  const handleSubmit = useCallback(() => {
    return form.handleSubmit(async data => {
      const res = await api.requestResetPassword(data);

      if (res.error) {
        notification.error({ message: res.error.message });
      } else if (res.data) {
        notification.success({ message: res.data.message });
        navigate({ to: "/auth/signIn" }).then();
      }
    })();
  }, [form, navigate, api]);

  return { form, handleSubmit };
};
