import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { observer } from "mobx-react-lite";
import React, { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { useApi } from "~@api/hooks";
import { AuthLayout } from "~@components/layouts";
import { Button, Card, InputFormField } from "~@components/ui2";

const schema = z.object({
  login: z.string().min(1, "Email or phone is required"),
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

  return (
    <AuthLayout>
      <Card className="p-6">
        {sent ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-success" />
            </div>
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">
              Email sent
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] mb-6">
              If an account exists for this email, you will receive a password
              reset link shortly.
            </p>
            <Button type="button" variant="ghost" onClick={onBack}>
              Back to sign in
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[var(--foreground)]">
                Forgot password
              </h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Enter your email or phone to receive a reset link
              </p>
            </div>

            <FormProvider {...methods}>
              <div className="flex flex-col gap-4">
                <InputFormField<FormData>
                  name="login"
                  label="Email or phone"
                  placeholder="email@example.com"
                />
                <Button
                  type="button"
                  loading={loading}
                  className="w-full"
                  onClick={handleSubmit(onSubmit)}
                >
                  Send reset link
                </Button>
                <Button type="button" variant="outline" onClick={onBack} className="w-full">
                  Back to sign in
                </Button>
              </div>
            </FormProvider>
          </>
        )}
      </Card>
    </AuthLayout>
  );
});
