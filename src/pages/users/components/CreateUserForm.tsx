import { zodResolver } from "@hookform/resolvers/zod";
import { useHotkeys } from "@mantine/hooks";
import React, { FC, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { EPermissions, ERole } from "~@api/api-gen/data-contracts";
import { InputFormField, SelectFormField } from "~@components/ui";

import { PermissionsEditor } from "./PermissionsEditor";

const schema = z
  .object({
    email: z
      .string()
      .refine(
        v => v === "" || z.string().email().safeParse(v).success,
        "Неверный email",
      ),
    phone: z.string().optional(),
    password: z.string().min(6, "Минимум 6 символов"),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    role: z.nativeEnum(ERole),
  })
  .refine(d => d.email || d.phone, {
    message: "Email или телефон обязателен",
    path: ["email"],
  });

export type CreateUserFormData = z.infer<typeof schema>;

interface CreateUserFormProps {
  loading?: boolean;
  onSubmit: (
    data: CreateUserFormData,
    permissions: EPermissions[],
  ) => Promise<void>;
}

export const CreateUserForm: FC<CreateUserFormProps> = ({
  loading: _loading,
  onSubmit,
}) => {
  const [permissions, setPermissions] = useState<EPermissions[]>([
    EPermissions.Read,
  ]);

  const methods = useForm<CreateUserFormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: ERole.User },
  });

  const { handleSubmit } = methods;

  const handleFormSubmit = async (data: CreateUserFormData) => {
    await onSubmit(data, permissions);
  };

  useHotkeys([["Enter", () => handleSubmit(handleFormSubmit)()]], ["SELECT"]);

  return (
    <FormProvider {...methods}>
      <form
        id="create-user-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-4 my-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <InputFormField<CreateUserFormData> name="firstName" label="Имя" />
          <InputFormField<CreateUserFormData> name="lastName" label="Фамилия" />
        </div>
        <InputFormField<CreateUserFormData>
          name="email"
          label="Email"
          type="email"
          placeholder="user@example.com"
        />
        <InputFormField<CreateUserFormData>
          name="phone"
          label="Телефон"
          placeholder="+1234567890"
        />
        <InputFormField<CreateUserFormData>
          name="password"
          label="Пароль"
          type="password"
          required
        />
        <SelectFormField<CreateUserFormData>
          name="role"
          label="Роль"
          placeholder="Выберите роль"
          options={[
            { value: ERole.Admin, label: "Администратор" },
            { value: ERole.User, label: "Пользователь" },
            { value: ERole.Guest, label: "Гость" },
          ]}
        />

        <div>
          <p className="text-sm font-medium text-foreground mb-3">
            Права доступа
          </p>
          <PermissionsEditor value={permissions} onChange={setPermissions} />
        </div>
      </form>
    </FormProvider>
  );
};
