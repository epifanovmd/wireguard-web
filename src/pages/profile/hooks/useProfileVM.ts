import { zodResolver } from "@hookform/resolvers/zod";
import { parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useApi } from "~@api";
import { EProfileStatus } from "~@api/api-gen/data-contracts";
import { useToast } from "~@components/ui2";
import { ProfileModel } from "~@models";
import { useProfileDataStore } from "~@store";

export const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  gender: z.string().optional(),
  birthDate: z.date().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const useProfileVM = () => {
  const api = useApi();
  const toast = useToast();
  const profileStore = useProfileDataStore();
  const [saving, setSaving] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);

  const { profile, isLoading } = profileStore;
  const model = profile ? new ProfileModel(profile) : undefined;

  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {},
  });

  const { reset } = methods;

  useEffect(() => {
    if (!profile) return;

    reset({
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      gender: profile.gender ?? "",
      birthDate: profile.birthDate ? parseISO(profile.birthDate) : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);

    const res = await profileStore.updateProfile({
      firstName: data.firstName || undefined,
      lastName: data.lastName || undefined,
      gender: data.gender || undefined,
      birthDate: data.birthDate?.toISOString(),
    });

    setSaving(false);

    if ("error" in res && res.error) {
      toast.error(res.error.message);
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
    isLoading,
    saving,
    sendingVerification,
    methods,
    onSubmit: methods.handleSubmit(onSubmit),
    sendEmailVerification,
  };
};
