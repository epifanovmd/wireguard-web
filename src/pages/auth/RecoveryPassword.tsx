import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useApi } from "~@api/hooks";
import { AuthLayout } from "~@components/layouts";
import { Button, Card, Input } from "~@components/ui2";

const schema = z.object({
  login: z.string().min(1, "Email or phone is required"),
  password: z.string().min(6, "Min 6 characters"),
});

type FormData = z.infer<typeof schema>;

export const RecoveryPassword = observer(() => {
  const api = useApi();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await api.requestResetPassword({ login: data.login });
    navigate({ to: "/auth/signIn" });
  };

  return (
    <AuthLayout>
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[var(--foreground)]">
            Recovery password
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Enter your email to receive a reset link
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Email or phone"
            type="email"
            placeholder="email@example.com"
            error={errors.login?.message}
            {...register("login")}
          />
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
});
