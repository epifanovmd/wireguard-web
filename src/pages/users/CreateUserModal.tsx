import { FC, useState } from "react";

import { EPermissions, TSignUpRequestDto } from "~@api/api-gen/data-contracts";
import { useApi } from "~@api/hooks";
import { CreateUserForm, CreateUserFormData } from "~@components/forms";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
} from "~@components/ui";
import { useNotification } from "~@core/notifications";

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
  const toast = useNotification();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    data: CreateUserFormData,
    permissions: EPermissions[],
  ) => {
    setLoading(true);
    try {
      const signUpData: TSignUpRequestDto = {
        password: data.password,
        email: data.email,
        ...(data.phone && { phone: data.phone }),
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.lastName && { lastName: data.lastName }),
      };

      const res = await api.signUp(signUpData);

      if (res.error) {
        toast.error(res.error.message);

        return;
      }

      if (res.data) {
        await api.setPrivileges({ id: res.data.id }, {
          roles: [data.role],
          permissions,
        });
        toast.success("Пользователь создан");
        onCreated();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={open => !open && onClose()}>
      <ModalOverlay />
      <ModalContent className="max-w-lg">
        <ModalHeader>
          <ModalTitle>Создать пользователя</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <CreateUserForm onSubmit={handleSubmit} />
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" form="create-user-form" loading={loading}>
            Создать
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
