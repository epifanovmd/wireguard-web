import * as React from "react";

import { Button } from "../button";
import { type ConfirmOptions } from "./ModalContext";
import { ModalDescription } from "./ModalDescription";
import { ModalFooter } from "./ModalFooter";
import { ModalHeader } from "./ModalHeader";
import { ModalTitle } from "./ModalTitle";

interface ConfirmModalProps extends ConfirmOptions {
  onClose: () => void;
}

export const ConfirmModal = ({
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "primary",
  onConfirm,
  onCancel,
  onClose,
}: ConfirmModalProps) => {
  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  return (
    <>
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
        {description && <ModalDescription>{description}</ModalDescription>}
      </ModalHeader>
      <ModalFooter>
        <Button variant="outline" onClick={handleCancel} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant={confirmVariant} onClick={handleConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </ModalFooter>
    </>
  );
};
