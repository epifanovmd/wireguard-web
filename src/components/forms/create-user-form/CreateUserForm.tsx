import { zodResolver } from "@hookform/resolvers/zod";
import { useHotkeys } from "@mantine/hooks";
import { FC, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { EPermissions, ERole } from "~@api/api-gen/data-contracts";
import { InputFormField, SelectFormField } from "~@components/ui";

import { useRolesSelectOptions } from "../../../hooks/useRolesSelectOptions";
import { PermissionsEditor } from "../permissions-editor";
import { CreateUserFormData, createUserSchema } from "./schema";

export type { CreateUserFormData };

interface CreateUserFormProps {
  onSubmit: (
    data: CreateUserFormData,
    permissions: EPermissions[],
  ) => Promise<void>;
}

export const CreateUserForm: FC<CreateUserFormProps> = ({ onSubmit }) => {
  const [permissions, setPermissions] = useState<EPermissions[]>([]);
  const { options: roleOptions, getRolePermissions } = useRolesSelectOptions();

  const methods = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: ERole.User },
  });

  const { handleSubmit, watch } = methods;
  const selectedRole = watch("role");
  const rolePermissions = getRolePermissions(selectedRole);

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
          options={roleOptions}
        />

        <div>
          <p className="text-sm font-medium text-foreground mb-3">
            Права доступа
          </p>
          <PermissionsEditor
            value={permissions}
            onChange={setPermissions}
            rolePermissions={rolePermissions}
            role={selectedRole}
          />
        </div>
      </form>
    </FormProvider>
  );
};
