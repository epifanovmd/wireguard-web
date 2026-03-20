import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { useApi } from "~@api/hooks";
import { AuthLayout } from "~@components/layouts";
import { Button, Card, InputFormField } from "~@components/ui";

const schema = z.object({
  login: z.string().min(1, "Email или телефон обязателен"),
  password: z.string().min(6, "Минимум 6 символов"),
});

type FormData = z.infer<typeof schema>;

export const RecoveryPassword = observer(() => {
  const api = useApi();
  const navigate = useNavigate();

  const methods = useForm<FormData>({ resolver: zodResolver(schema) });
  const { handleSubmit } = methods;

  const onSubmit = async (data: FormData) => {
    await api.requestResetPassword({ login: data.login });
    navigate({ to: "/auth/signIn" });
  };

  return (
    <AuthLayout>
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[var(--foreground)]">
            Восстановление пароля
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Введите email для получения ссылки сброса
          </p>
        </div>
        <FormProvider {...methods}>
          <div className="flex flex-col gap-4">
            <InputFormField<FormData>
              name="login"
              label="Email или телефон"
              type="email"
              placeholder="email@example.com"
            />
            <Button
              type="button"
              className="w-full"
              onClick={handleSubmit(onSubmit)}
            >
              Отправить ссылку
            </Button>
          </div>
        </FormProvider>
      </Card>
    </AuthLayout>
  );
});
