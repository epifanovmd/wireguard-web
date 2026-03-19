import { zodResolver } from "@hookform/resolvers/zod";
import { useHotkeys } from "@mantine/hooks";
import { useNavigate } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { AuthLayout } from "~@components/layouts";
import { Button, Card, InputFormField } from "~@components/ui2";
import { useAuthStore } from "~@store";

const schema = z.object({
  email: z.string().email("Неверный email"),
  password: z.string().min(6, "Минимум 6 символов"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export const SignUp = observer(() => {
  const auth = useAuthStore();
  const navigate = useNavigate();

  const methods = useForm<FormData>({ resolver: zodResolver(schema) });
  const { handleSubmit } = methods;

  const onSubmit = async (data: FormData) => {
    await auth.signUp({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    });
    if (auth.isAuthenticated) navigate({ to: "/" });
  };

  useHotkeys([["Enter", () => handleSubmit(onSubmit)()]], []);

  return (
    <AuthLayout>
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[var(--foreground)]">
            Создать аккаунт
          </h2>
        </div>
        <FormProvider {...methods}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <InputFormField<FormData> name="firstName" label="Имя" />
              <InputFormField<FormData> name="lastName" label="Фамилия" />
            </div>
            <InputFormField<FormData>
              name="email"
              label="Email"
              type="email"
              required
            />
            <InputFormField<FormData>
              name="password"
              label="Пароль"
              type="password"
              required
            />
            <Button
              type="button"
              loading={auth.isLoading}
              className="w-full"
              onClick={handleSubmit(onSubmit)}
            >
              Создать аккаунт
            </Button>
          </div>
        </FormProvider>
      </Card>
    </AuthLayout>
  );
});
