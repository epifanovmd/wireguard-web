import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthLayout } from "~@components/layouts";
import { Button, Card, Input } from "~@components/ui2";
import { useSessionDataStore } from "~@store";

const schema = z.object({
  login: z.string().min(1, "Login is required"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export const SignIn = observer(() => {
  const session = useSessionDataStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await session.signIn({ login: data.login, password: data.password });
    if (session.isAuthorized) {
      navigate({ to: "/" });
    }
  };

  return (
    <AuthLayout>
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[var(--foreground)]">Sign in</h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Enter your credentials to access the admin panel
          </p>
        </div>

        {session.lastError && (
          <div className="mb-4 px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{session.lastError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Email or phone"
            placeholder="email@example.com"
            error={errors.login?.message}
            {...register("login")}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          <div className="flex justify-end">
            <Link
              className="text-sm text-[#6366f1] hover:underline"
              to={"/auth/recovery-password"}
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" loading={session.isLoading} className="w-full">
            Sign in
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
});
