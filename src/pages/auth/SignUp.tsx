import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { AuthLayout } from "~@components/layouts";
import { Button, Card, InputFormField } from "~@components/ui2";
import { useSessionDataStore } from "~@store";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export const SignUp = observer(() => {
  const session = useSessionDataStore();
  const navigate = useNavigate();

  const methods = useForm<FormData>({ resolver: zodResolver(schema) });
  const { handleSubmit } = methods;

  const onSubmit = async (data: FormData) => {
    await session.signUp({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    });
    if (session.isAuthorized) navigate({ to: "/" });
  };

  return (
    <AuthLayout>
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[var(--foreground)]">
            Create account
          </h2>
        </div>
        <FormProvider {...methods}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <InputFormField<FormData> name="firstName" label="First name" />
              <InputFormField<FormData> name="lastName" label="Last name" />
            </div>
            <InputFormField<FormData>
              name="email"
              label="Email"
              type="email"
              required
            />
            <InputFormField<FormData>
              name="password"
              label="Password"
              type="password"
              required
            />
            <Button
              type="button"
              loading={session.isLoading}
              className="w-full"
              onClick={handleSubmit(onSubmit)}
            >
              Create account
            </Button>
          </div>
        </FormProvider>
      </Card>
    </AuthLayout>
  );
});
