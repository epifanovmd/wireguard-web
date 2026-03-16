import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { EPermissions, ERole } from "~@api/api-gen/data-contracts";
import { useApi } from "~@api/hooks";
import { Button, Input, Modal, Select, useToast } from "~@components";

import { PermissionsEditor } from "./components/PermissionsEditor";

const schema = z
  .object({
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z.string().optional(),
    password: z.string().min(6, "Min 6 characters"),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    role: z.nativeEnum(ERole),
  })
  .refine(d => d.email || d.phone, {
    message: "Email or phone required",
    path: ["email"],
  });

type FormData = z.infer<typeof schema>;

interface CreateUserDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const CreateUserModal: FC<CreateUserDrawerProps> = ({
  open,
  onClose,
  onCreated,
}) => {
  const api = useApi();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<EPermissions[]>([
    EPermissions.Read,
  ]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: ERole.User },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const signUpData: any = { password: data.password };
    if (data.email) signUpData.email = data.email;
    if (data.phone) signUpData.phone = data.phone;
    if (data.firstName) signUpData.firstName = data.firstName;
    if (data.lastName) signUpData.lastName = data.lastName;

    const res = await api.signUp(signUpData);
    if (res.error) {
      toast.error(res.error.message);
    } else if (res.data) {
      await api.setPrivileges(res.data.id, {
        roleName: data.role,
        permissions,
      });
      toast.success("User created");
      reset();
      onCreated();
    }
    setLoading(false);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create user"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={loading} onClick={handleSubmit(onSubmit)}>
            Create
          </Button>
        </>
      }
    >
      <form className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="First name" {...register("firstName")} />
          <Input label="Last name" {...register("lastName")} />
        </div>
        <Input
          label="Email"
          type="email"
          placeholder="user@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input label="Phone" placeholder="+1234567890" {...register("phone")} />
        <Input
          label="Password"
          type="password"
          required
          error={errors.password?.message}
          {...register("password")}
        />
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select
              label="Role"
              data={[
                { value: ERole.Admin, label: "Admin" },
                { value: ERole.User, label: "User" },
                { value: ERole.Guest, label: "Guest" },
              ]}
              value={field.value}
              onChange={v => field.onChange(v ?? ERole.User)}
            />
          )}
        />

        <div>
          <p className="text-sm font-medium text-[var(--text-primary)] mb-3">
            Permissions
          </p>
          <PermissionsEditor value={permissions} onChange={setPermissions} />
        </div>
      </form>
    </Modal>
  );
};
