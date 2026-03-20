import React, { FC } from "react";

import { Modal, ModalContent, ModalOverlay } from "~@components/ui";

import { CreateUserForm } from "./components/CreateUserForm";

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const CreateUserModal: FC<CreateUserModalProps> = ({
  open,
  onClose,
  onCreated,
}) => (
  <Modal open={open} onOpenChange={open => !open && onClose()}>
    <ModalOverlay />
    <ModalContent className="max-w-lg" title="Создать пользователя">
      <CreateUserForm onCancel={onClose} onCreated={onCreated} />
    </ModalContent>
  </Modal>
);
