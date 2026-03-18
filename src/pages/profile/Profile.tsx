import { zodResolver } from "@hookform/resolvers/zod";
import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { useApi } from "~@api";
import { EProfileStatus, UserDto } from "~@api/api-gen/data-contracts";
import { PageHeader } from "~@components/layouts";
import {
  Badge,
  Button,
  Card,
  InputFormField,
  SelectFormField,
  Spinner,
  useToast,
} from "~@components/ui2";
import { useProfileDataStore } from "~@store";

import { UserAvatar } from "../users/components/UserAvatar";
import { UserRoleBadge } from "../users/components/UserRoleBadge";

const schema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  gender: z.string().optional(),
  birthDate: z.string().optional(),
  status: z.nativeEnum(EProfileStatus).optional(),
});

type ProfileFormData = z.infer<typeof schema>;

export const Profile: FC = observer(() => {
  const toast = useToast();
  const profileStore = useProfileDataStore();
  const [loadingUser, setLoadingUser] = useState(false);
  const [saving, setSaving] = useState(false);

  const { profile } = profileStore;

  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (!profile) return;

    reset({
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      gender: profile.gender ?? "",
      birthDate: profile.birthDate
        ? new Date(profile.birthDate).toISOString().split("T")[0]
        : "",
      status: (profile.status as EProfileStatus) ?? undefined,
    });
  }, [profile, reset]);

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

  if (loadingUser || profileStore.isLoading) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader title="Мой профиль" />
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      </div>
    );
  }

  const displayName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    profile?.user?.email ||
    profile?.user?.phone ||
    "Профиль";

  const initials =
    [profile?.firstName, profile?.lastName]
      .filter(Boolean)
      .map(s => s![0])
      .join("")
      .toUpperCase() || (profile?.user?.email?.[0] ?? "U").toUpperCase();

  const roleLabel = profile?.user?.role?.name ?? "user";

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Мой профиль"
        subtitle="Просмотр и редактирование профиля"
      />

      <div className="p-4 sm:p-6 flex gap-6 flex-wrap xl:flex-nowrap">
        {/* Sidebar — info card */}
        <div className="w-full xl:w-64 flex-shrink-0 flex flex-col gap-4">
          <Card className="p-4">
            <div className="flex flex-col items-center text-center gap-2.5">
              <UserAvatar name={displayName} size="lg" />
              <div>
                <p className="font-semibold text-[var(--foreground)]">
                  {displayName}
                </p>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  {profile?.user?.email ?? profile?.user?.phone ?? "—"}
                </p>
              </div>
              <UserRoleBadge role={roleLabel} />
              {profile?.user?.emailVerified !== undefined && (
                <Badge
                  variant={profile?.user.emailVerified ? "success" : "gray"}
                  dot
                >
                  {profile?.user.emailVerified
                    ? "Email подтверждён"
                    : "Email не подтверждён"}
                </Badge>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-col gap-2 text-xs">
              {profile?.user?.createdAt && (
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">
                    Зарегистрирован
                  </span>
                  <span className="text-[var(--muted-foreground)]">
                    {new Date(profile?.user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              {profile?.lastOnline && (
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">
                    Последний визит
                  </span>
                  <span className="text-[var(--muted-foreground)]">
                    {new Date(profile.lastOnline).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Main content — edit form */}
        <div className="flex-1 min-w-0">
          <FormProvider {...methods}>
            <div className="flex flex-col gap-6">
              <Card title="Личные данные" className="p-5">
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputFormField<ProfileFormData>
                      name="firstName"
                      label="Имя"
                      placeholder="Иван"
                    />
                    <InputFormField<ProfileFormData>
                      name="lastName"
                      label="Фамилия"
                      placeholder="Иванов"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputFormField<ProfileFormData>
                      name="gender"
                      label="Пол"
                      placeholder="Мужской / Женский"
                    />
                    <InputFormField<ProfileFormData>
                      name="birthDate"
                      label="Дата рождения"
                      type="date"
                    />
                  </div>

                  <SelectFormField<ProfileFormData>
                    name="status"
                    label="Статус"
                    placeholder="Выберите статус"
                    options={[
                      { value: EProfileStatus.Online, label: "Онлайн" },
                      { value: EProfileStatus.Offline, label: "Оффлайн" },
                    ]}
                  />
                </div>
              </Card>

              <Card title="Учётная запись" className="p-5">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm text-[var(--muted-foreground)]">
                      Email
                    </span>
                    <span className="text-sm text-[var(--foreground)]">
                      {profile?.user?.email ?? "—"}
                    </span>
                  </div>
                  {profile?.user?.phone && (
                    <div className="flex items-center justify-between py-1">
                      <span className="text-sm text-[var(--muted-foreground)]">
                        Телефон
                      </span>
                      <span className="text-sm text-[var(--foreground)]">
                        {profile?.user.phone}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm text-[var(--muted-foreground)]">
                      Роль
                    </span>
                    <UserRoleBadge role={roleLabel} />
                  </div>
                </div>
              </Card>

              <div className="flex justify-end">
                <Button loading={saving} onClick={handleSubmit(onSubmit)}>
                  Сохранить
                </Button>
              </div>
            </div>
          </FormProvider>
        </div>
      </div>
    </div>
  );
});
