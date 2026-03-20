import { useHotkeys } from "@mantine/hooks";
import { observer } from "mobx-react-lite";
import React from "react";
import { FormProvider } from "react-hook-form";

import { AuthLayout } from "~@components/layouts";
import { Button, Card, InputFormField } from "~@components/ui";
import { useAuthStore } from "~@store";

import { useSignUpVM } from "./hooks";
import { TSignUpForm } from "./validations";

export const SignUp = observer(() => {
  const auth = useAuthStore();
  const { form, handleSignUp } = useSignUpVM();

  useHotkeys([["Enter", () => handleSignUp()]], []);

  return (
    <AuthLayout>
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[var(--foreground)]">
            Создать аккаунт
          </h2>
        </div>
        <FormProvider {...form}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <InputFormField<TSignUpForm> name="firstName" label="Имя" />
              <InputFormField<TSignUpForm> name="lastName" label="Фамилия" />
            </div>
            <InputFormField<TSignUpForm>
              name="login"
              label="Логин / Email"
              type="email"
              required
            />
            <InputFormField<TSignUpForm>
              name="password"
              label="Пароль"
              type="password"
              required
            />
            <InputFormField<TSignUpForm>
              name="confirmPassword"
              label="Подтверждение пароля"
              type="password"
              required
            />
            <Button
              type="button"
              loading={auth.isLoading}
              className="w-full"
              onClick={handleSignUp}
            >
              Создать аккаунт
            </Button>
          </div>
        </FormProvider>
      </Card>
    </AuthLayout>
  );
});
