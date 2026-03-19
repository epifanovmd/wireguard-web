import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { FormProvider } from "react-hook-form";

import { PageHeader } from "~@components/layouts";
import { UserInfoCard } from "~@components/shared";
import {
  Button,
  Card,
  DatePickerFormField,
  InputFormField,
  SelectFormField,
  Spinner,
} from "~@components/ui2";

import { ProfileFormData, useProfileVM } from "./hooks/useProfileVM";

export const Profile: FC = observer(() => {
  const {
    model,
    isLoading,
    saving,
    sendingVerification,
    methods,
    onSubmit,
    sendEmailVerification,
  } = useProfileVM();

  if (isLoading && !model) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <PageHeader title="Мой профиль" />
        <div className="flex justify-center py-12 overflow-auto">
          <Spinner />
        </div>
      </div>
    );
  }

  const emailVerificationAction =
    model?.email && !model.emailVerified ? (
      <Button
        size="sm"
        variant="outline"
        loading={sendingVerification}
        onClick={sendEmailVerification}
      >
        Подтвердить email
      </Button>
    ) : undefined;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader
        title="Мой профиль"
        subtitle="Просмотр и редактирование профиля"
      />

      <div className="p-4 sm:p-6 flex gap-6 flex-wrap xl:flex-nowrap overflow-auto">
        <div className="w-full xl:w-64 flex-shrink-0">
          <UserInfoCard
            displayName={model?.displayName ?? "Профиль"}
            login={model?.login}
            role={model?.roleLabel}
            emailVerified={model?.emailVerified}
            registeredAt={model?.registeredAtDate.formattedDate}
            lastOnline={model?.lastOnlineDate.formattedDate}
            actions={emailVerificationAction}
          />
        </div>

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
                    <DatePickerFormField<ProfileFormData>
                      name="birthDate"
                      label="Дата рождения"
                      placeholder="Выберите дату"
                      clearable
                    />
                  </div>
                </div>
              </Card>

              <Card title="Учётная запись" className="p-5">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm text-[var(--muted-foreground)]">
                      Email
                    </span>
                    <span className="text-sm text-[var(--foreground)]">
                      {model?.email ?? "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm text-[var(--muted-foreground)]">
                      Телефон
                    </span>
                    <span className="text-sm text-[var(--foreground)]">
                      {model?.phone ?? "—"}
                    </span>
                  </div>
                </div>
              </Card>

              <div className="flex justify-end">
                <Button loading={saving} onClick={onSubmit}>
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
