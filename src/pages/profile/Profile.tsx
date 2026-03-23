import { observer } from "mobx-react-lite";
import { FC } from "react";
import { FormProvider } from "react-hook-form";

import { PageHeader, PageLayout } from "~@components/layouts";
import { UserInfoCard } from "~@components/shared";
import {
  AsyncButton,
  Button,
  Card,
  DatePickerFormField,
  InputFormField,
} from "~@components/ui";

import { ProfileFormData, useProfileVM } from "./hooks/useProfileVM";

export const Profile: FC = observer(() => {
  const {
    model,
    sendingVerification,
    methods,
    onSubmit,
    sendEmailVerification,
  } = useProfileVM();

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
    <PageLayout
      header={
        <PageHeader
          title="Мой профиль"
          subtitle="Просмотр и редактирование профиля"
        />
      }
    >
      <div className={"flex gap-3 sm:gap-6 flex-wrap xl:flex-nowrap"}>
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
            <div className="flex flex-col gap-3 sm:gap-6">
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
                    <span className="text-sm text-muted-foreground">Email</span>
                    <span className="text-sm text-foreground">
                      {model?.email ?? "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm text-muted-foreground">
                      Телефон
                    </span>
                    <span className="text-sm text-foreground">
                      {model?.phone ?? "—"}
                    </span>
                  </div>
                </div>
              </Card>

              <div className="flex justify-end">
                <AsyncButton onClick={onSubmit}>Сохранить</AsyncButton>
              </div>
            </div>
          </FormProvider>
        </div>
      </div>
    </PageLayout>
  );
});
