import { zodResolver } from "@hookform/resolvers/zod";
import { useHotkeys } from "@mantine/hooks";
import { useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { observer } from "mobx-react-lite";
import React, { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { useApi } from "~@api/hooks";
import { AuthLayout } from "~@components/layouts";
import { Button, Card, InputFormField } from "~@components/ui";

const schema = z.object({
  login: z.string().min(1, "Email или телефон обязателен"),
});

type FormData = z.infer<typeof schema>;

export const ForgotPassword = observer(() => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = methods;

  const onBack = useCallback(() => {
    return navigate({ to: "/auth/signIn" });
  }, [navigate]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    await api.requestResetPassword({ login: data.login });
    setLoading(false);
    setSent(true);
  };

  useHotkeys([["Enter", () => handleSubmit(onSubmit)()]], []);

  return (
    <AuthLayout>
      <Card className="p-6">
        {sent ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-success" />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-2">
              Письмо отправлено
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Если аккаунт с таким email существует, вы получите ссылку для
              сброса пароля.
            </p>
            <Button type="button" variant="ghost" onClick={onBack}>
              Вернуться к входу
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground">
                Восстановление пароля
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Введите email или телефон для получения ссылки сброса
              </p>
            </div>

            <FormProvider {...methods}>
              <div className="flex flex-col gap-4">
                <InputFormField<FormData>
                  name="login"
                  label="Email или телефон"
                  placeholder="email@example.com"
                />
                <Button
                  type="button"
                  loading={loading}
                  className="w-full"
                  onClick={handleSubmit(onSubmit)}
                >
                  Отправить ссылку
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="w-full"
                >
                  Вернуться к входу
                </Button>
              </div>
            </FormProvider>
          </>
        )}
      </Card>
    </AuthLayout>
  );
});
