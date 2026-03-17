import * as React from "react";

import { ConfirmModal } from "./ConfirmModal";
import { Modal } from "./Modal";
import { ModalContent } from "./ModalContent";
import {
  type ConfirmOptions,
  ModalContext,
  type ModalContextValue,
  type ModalEntry,
  type ModalOptions,
} from "./ModalContext";

const CLOSE_ANIMATION_DURATION = 200;

const generateId = () => `modal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modals, setModals] = React.useState<ModalEntry[]>([]);

  const openModal = React.useCallback((options: ModalOptions): string => {
    const id = generateId();
    setModals(prev => [...prev, { id, open: true, options }]);
    return id;
  }, []);

  const closeModal = React.useCallback((id: string) => {
    setModals(prev => prev.map(m => (m.id === id ? { ...m, open: false } : m)));
    setTimeout(() => {
      setModals(prev => prev.filter(m => m.id !== id));
    }, CLOSE_ANIMATION_DURATION);
  }, []);

  const closeAll = React.useCallback(() => {
    setModals(prev => prev.map(m => ({ ...m, open: false })));
    setTimeout(() => setModals([]), CLOSE_ANIMATION_DURATION);
  }, []);

  const confirm = React.useCallback(
    (options: ConfirmOptions) => {
      let id: string;
      const close = () => closeModal(id);

      id = openModal({
        size: options.size ?? "sm",
        disableInteractOutside: true,
        hideCloseButton: true,
        content: <ConfirmModal {...options} onClose={close} />,
      });
    },
    [openModal, closeModal],
  );

  const value = React.useMemo<ModalContextValue>(
    () => ({ openModal, closeModal, closeAll, confirm }),
    [openModal, closeModal, closeAll, confirm],
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modals.map(({ id, open, options }) => (
        <Modal
          key={id}
          open={open}
          onOpenChange={isOpen => {
            if (!isOpen) {
              options.onClose?.();
              closeModal(id);
            }
          }}
        >
          <ModalContent
            size={options.size}
            position={options.position}
            disableInteractOutside={options.disableInteractOutside}
            hideCloseButton={options.hideCloseButton}
            scrollable={options.scrollable}
          >
            {options.content}
          </ModalContent>
        </Modal>
      ))}
    </ModalContext.Provider>
  );
};
