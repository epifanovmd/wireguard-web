import { useApi } from "@api";
import { useNotification } from "@core/notifications";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@store";
import { parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  gender: z.string().optional(),
  birthDate: z.date().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const useProfileVM = () => {
  const api = useApi();
  const toast = useNotification();
  const authStore = useAuthStore();
  const [sendingVerification, setSendingVerification] = useState(false);

  const profile = authStore.user?.profile;
  const model = authStore.profile;

  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {},
  });

  useEffect(() => {
    authStore.load().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!profile) return;

    methods.reset({
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      gender: profile.gender ?? "",
      birthDate: profile.birthDate ? parseISO(profile.birthDate) : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const onSubmit = async (data: ProfileFormData) => {
    await authStore.updateProfile({
      firstName: data.firstName || undefined,
      lastName: data.lastName || undefined,
      gender: data.gender || undefined,
      birthDate: data.birthDate?.toISOString(),
    });

    if (authStore.error) {
      toast.error(authStore.error);
    } else {
      toast.success("Профиль обновлён");
    }
  };

  const sendEmailVerification = async () => {
    setSendingVerification(true);
    const res = await api.requestVerifyEmail();

    setSendingVerification(false);

    if (res.error) {
      toast.error(res.error.message);
    } else {
      toast.success("Письмо с подтверждением отправлено");
    }
  };

  return {
    model,
    sendingVerification,
    methods,
    onSubmit: methods.handleSubmit(onSubmit),
    sendEmailVerification,
  };
};
