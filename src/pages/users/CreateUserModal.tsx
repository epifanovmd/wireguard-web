import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { EPermissions, ERole } from "~@api/api-gen/data-contracts";
import { useApi } from "~@api/hooks";
import {
  Button,
  InputFormField,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  SelectFormField,
  useToast,
} from "~@components/ui2";

import { PermissionsEditor } from "./components/PermissionsEditor";

const schema = z
  .object({
    email: z
      .string()
      .refine(
        v => v === "" || z.string().email().safeParse(v).success,
        "Invalid email",
      ),
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

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const CreateUserModal: FC<CreateUserModalProps> = ({
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

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: ERole.User },
  });

  const { handleSubmit, reset } = methods;

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
    <Modal open={open} onOpenChange={open => !open && onClose()}>
      <ModalOverlay />
      <ModalContent className="max-w-lg">
        <ModalHeader>
          <ModalTitle>Create user</ModalTitle>
        </ModalHeader>
        <ModalBody>
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
                placeholder="user@example.com"
              />
              <InputFormField<FormData>
                name="phone"
                label="Phone"
                placeholder="+1234567890"
              />
              <InputFormField<FormData>
                name="password"
                label="Password"
                type="password"
                required
              />
              <SelectFormField<FormData>
                name="role"
                label="Role"
                placeholder="Select role"
                options={[
                  { value: ERole.Admin, label: "Admin" },
                  { value: ERole.User, label: "User" },
                  { value: ERole.Guest, label: "Guest" },
                ]}
              />

              <div>
                <p className="text-sm font-medium text-[var(--foreground)] mb-3">
                  Permissions
                </p>
                <PermissionsEditor value={permissions} onChange={setPermissions} />
              </div>
            </div>
          </FormProvider>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={loading} onClick={handleSubmit(onSubmit)}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
