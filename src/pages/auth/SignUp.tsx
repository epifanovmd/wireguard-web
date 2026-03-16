import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AuthLayout, Button, Card, Input } from "~@components";
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

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
      <Card>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Create account
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First name" {...register("firstName")} />
            <Input label="Last name" {...register("lastName")} />
          </div>
          <Input
            label="Email"
            type="email"
            required
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Password"
            type="password"
            required
            error={errors.password?.message}
            {...register("password")}
          />
          <Button type="submit" loading={session.isLoading}>
            Create account
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
});
