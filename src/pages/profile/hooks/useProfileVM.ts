import { zodResolver } from "@hookform/resolvers/zod";
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
  birthDate: z.string().optional(),
  status: z.nativeEnum(EProfileStatus).optional(),
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
    if (!model) return;

    reset({
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? "",
      gender: profile?.gender ?? "",
      birthDate: model.birthDateInput,
      status: (profile?.status as EProfileStatus) ?? undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);

    const payload: Record<string, unknown> = {};

    if (data.firstName !== undefined)
      payload.firstName = data.firstName || undefined;
    if (data.lastName !== undefined)
      payload.lastName = data.lastName || undefined;
    if (data.gender) payload.gender = data.gender;
    if (data.birthDate)
      payload.birthDate = new Date(data.birthDate).toISOString();
    if (data.status) payload.status = data.status;

    const res = await profileStore.updateProfile(payload as any);

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
