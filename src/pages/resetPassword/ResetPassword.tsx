import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useApi } from "~@api/hooks";
import { AuthLayout, Button, Card, Input } from "~@components";

const schema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

interface ResetPasswordProps {
  token: string;
  onSuccess: () => void;
}

export const ResetPassword: FC<ResetPasswordProps> = ({ token, onSuccess }) => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    const res = await api.resetPassword({ token, password: data.password });
    setLoading(false);
    if (res.error) {
      setError(res.error.message);
    } else {
      onSuccess();
    }
  };

  return (
    <AuthLayout>
      <Card>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Reset password</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">Enter your new password</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="New password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <Button type="submit" fullWidth loading={loading}>
            Set new password
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
};
