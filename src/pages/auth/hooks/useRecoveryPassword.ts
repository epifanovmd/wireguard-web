import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { notification } from "antd";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { useProfileService } from "~@service/profile/hooks";
import { useProfileDataStore } from "~@store";

import {
  recoveryPasswordValidationSchema,
  TRecoveryPasswordForm,
} from "../validations";

export const useRecoveryPassword = () => {
  const profileService = useProfileService();
  const navigate = useNavigate();

  const form = useForm<TRecoveryPasswordForm>({
    defaultValues: {
      login: "",
    },
    resolver: zodResolver(recoveryPasswordValidationSchema),
  });

  const handleSubmit = useCallback(() => {
    return form.handleSubmit(async data => {
      const res = await profileService.requestResetPassword(data);

      if (res.error) {
        notification.error({ message: res.error.message });
      } else if (res.data) {
        notification.success({ message: res.data.message });
        navigate({ to: "/auth/signIn" }).then();
      }
    })();
  }, [form, navigate, profileService]);

  return { form, handleSubmit };
};
