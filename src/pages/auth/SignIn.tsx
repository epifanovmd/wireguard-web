import { usePasskeyAuth } from "@common";
import { AuthLayout } from "@components/layouts";
import { AsyncButton, Button, Card, InputFormField } from "@components/ui";
import { useHotkeys } from "@mantine/hooks";
import { useAuthStore } from "@store";
import { Link } from "@tanstack/react-router";
import { Fingerprint } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FormProvider } from "react-hook-form";

import { useSignInVM } from "./hooks";
import { TSignInForm } from "./validations";

export const SignIn = observer(() => {
  const auth = useAuthStore();
  const { form, handleLogin } = useSignInVM();
  const passkey = usePasskeyAuth();

  useHotkeys([["Enter", () => handleLogin()]], []);

  const passkeyError = passkey.error ?? (auth.error || null);

  return (
    <AuthLayout>
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">Вход</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Введите данные для входа в панель управления
          </p>
        </div>

        {passkeyError && (
          <div className="mb-4 px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{passkeyError}</p>
          </div>
        )}

        <FormProvider {...form}>
          <div className="flex flex-col gap-4">
            <InputFormField<TSignInForm>
              name="login"
              label="Email или телефон"
              placeholder="email@example.com"
            />
            <InputFormField<TSignInForm>
              name="password"
              label="Пароль"
              type="password"
              placeholder="••••••••"
            />

            <div className="flex justify-end">
              <Link
                className="text-sm text-brand hover:underline"
                to={"/auth/recovery-password"}
              >
                Забыли пароль?
              </Link>
            </div>

            <AsyncButton
              type="button"
              className="w-full"
              loading={auth.isLoading}
              onClick={handleLogin}
            >
              Войти
            </AsyncButton>

            {passkey.support && passkey.profileId && (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">или</span>
                  <div className="flex-1 h-px bg-border" />
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
