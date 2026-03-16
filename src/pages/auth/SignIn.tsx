import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { observer } from "mobx-react-lite";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthLayout, Button, Card, Input } from "~@components";
import { useSessionDataStore } from "~@store";

const schema = z.object({
  login: z.string().min(1, "Login is required"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export const SignIn = observer(() => {
  const session = useSessionDataStore();
  const [showPassword, setShowPassword] = React.useState(false);

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
      onSuccess();
    }
  };

  const onForgotPassword = () => navigate({ to: "/auth/recovery-password" });
  const onSuccess = () => navigate({ to: "/" });

  return (
    <AuthLayout>
      <Card>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Sign in
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Enter your credentials to access the admin panel
          </p>
        </div>

        {session.lastError && (
          <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              {session.lastError}
            </p>
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
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            error={errors.password?.message}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            {...register("password")}
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-[#6366f1] hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" loading={session.isLoading}>
            Sign in
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
});
