import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fingerprint } from "lucide-react";
import { observer } from "mobx-react-lite";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { usePasskeyAuth } from "~@common";
import { AuthLayout } from "~@components/layouts";
import { Button, Card, InputFormField } from "~@components/ui2";
import { useSessionDataStore } from "~@store";

const schema = z.object({
  login: z.string().min(1, "Login is required"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export const SignIn = observer(() => {
  const session = useSessionDataStore();
  const navigate = useNavigate();
  const passkey = usePasskeyAuth();

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: FormData) => {
    await session.signIn({ login: data.login, password: data.password });
    if (session.isAuthorized) {
      navigate({ to: "/" });
    }
  };

  const passkeyError = passkey.error ?? (session.lastError || null);

  return (
    <AuthLayout>
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[var(--foreground)]">
            Sign in
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Enter your credentials to access the admin panel
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
              label="Email or phone"
              placeholder="email@example.com"
            />
            <InputFormField<FormData>
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
            />

            <div className="flex justify-end">
              <Link
                className="text-sm text-[#6366f1] hover:underline"
                to={"/auth/recovery-password"}
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="button"
              loading={session.isLoading}
              className="w-full"
              onClick={handleSubmit(onSubmit)}
            >
              Sign in
            </Button>

            {passkey.support && passkey.profileId && (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[var(--border)]" />
                  <span className="text-xs text-[var(--muted-foreground)]">
                    or
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
                  Sign in with passkey
                </Button>
              </>
            )}
          </div>
        </FormProvider>
      </Card>
    </AuthLayout>
  );
});
