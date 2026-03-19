import { zodResolver } from "@hookform/resolvers/zod";
import { useHotkeys } from "@mantine/hooks";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fingerprint } from "lucide-react";
import { observer } from "mobx-react-lite";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { usePasskeyAuth } from "~@common";
import { AuthLayout } from "~@components/layouts";
import { Button, Card, InputFormField } from "~@components/ui2";
import { useAuthStore } from "~@store";

const schema = z.object({
  login: z.string().min(1, "Логин обязателен"),
  password: z.string().min(1, "Пароль обязателен"),
});

type FormData = z.infer<typeof schema>;

export const SignIn = observer(() => {
  const auth = useAuthStore();
  const navigate = useNavigate();
  const passkey = usePasskeyAuth();

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: FormData) => {
    await auth.signIn({ login: data.login, password: data.password });
    if (auth.isAuthenticated) {
      await navigate({ to: "/" });
    }
  };

  useHotkeys([["Enter", () => handleSubmit(onSubmit)()]], []);

  const passkeyError = passkey.error ?? (auth.error || null);

  return (
    <AuthLayout>
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[var(--foreground)]">Вход</h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Введите данные для входа в панель управления
          </p>
        </div>

        {passkeyError && (
          <div className="mb-4 px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{passkeyError}</p>
          </div>
        )}

        <FormProvider {...methods}>
          <div className="flex flex-col gap-4">
            <InputFormField<FormData>
              name="login"
              label="Email или телефон"
              placeholder="email@example.com"
            />
            <InputFormField<FormData>
              name="password"
              label="Пароль"
              type="password"
              placeholder="••••••••"
            />

            <div className="flex justify-end">
              <Link
                className="text-sm text-[#6366f1] hover:underline"
                to={"/auth/recovery-password"}
              >
                Забыли пароль?
              </Link>
            </div>

            <Button
              type="button"
              loading={auth.isLoading}
              className="w-full"
              onClick={handleSubmit(onSubmit)}
            >
              Войти
            </Button>

            {passkey.support && passkey.profileId && (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[var(--border)]" />
                  <span className="text-xs text-[var(--muted-foreground)]">
                    или
                  </span>
                  <div className="flex-1 h-px bg-[var(--border)]" />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  loading={passkey.loading}
                  onClick={passkey.handleLogin}
                >
                  <Fingerprint size={16} />
                  Войти с passkey
                </Button>
              </>
            )}
          </div>
        </FormProvider>
      </Card>
    </AuthLayout>
  );
});
