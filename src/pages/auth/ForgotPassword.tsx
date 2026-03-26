import { AuthLayout } from "@components/layouts";
import { Button, Card, InputFormField } from "@components/ui";
import { Check } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FormProvider } from "react-hook-form";

import { ForgotPasswordFormData, useForgotPasswordVM } from "./hooks";

export const ForgotPassword = observer(() => {
  const { methods, handleSubmit, onSubmit, onBack, loading, sent } =
    useForgotPasswordVM();

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
                <InputFormField<ForgotPasswordFormData>
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
