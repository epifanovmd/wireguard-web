import { useApi } from "@api/hooks";
import { AuthLayout } from "@components/layouts";
import { Button, Card, InputFormField } from "@components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z
  .object({
    password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
    confirmPassword: z.string().min(1, "Подтвердите пароль"),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: "Пароли не совпадают",
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

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = methods;

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
          <h2 className="text-xl font-bold text-foreground">Сброс пароля</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Введите новый пароль
          </p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <FormProvider {...methods}>
          <div className="flex flex-col gap-4">
            <InputFormField<FormData>
              name="password"
              label="Новый пароль"
              type="password"
              placeholder="••••••••"
            />
            <InputFormField<FormData>
              name="confirmPassword"
              label="Подтвердите пароль"
              type="password"
              placeholder="••••••••"
            />
            <Button
              type="button"
              className="w-full"
              loading={loading}
              onClick={handleSubmit(onSubmit)}
            >
              Установить пароль
            </Button>
          </div>
        </FormProvider>
      </Card>
    </AuthLayout>
  );
};
