import * as React from "react";

import { Modal } from "./Modal";
import { ModalContent } from "./ModalContent";
import {
  type ConfirmOptions,
  ModalContext,
  type ModalContextValue,
  type ModalEntry,
  type ModalOptions,
  type ModalRenderProps,
} from "./ModalContext";

const CLOSE_ANIMATION_DURATION = 200;

const generateId = () =>
  `modal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

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
      openModal({
        size: options.size ?? "sm",
        disableInteractOutside: true,
        hideCloseButton: true,
        title: options.title,
        description: options.description,
        onConfirm: options.onConfirm,
        confirmLabel: options.confirmLabel,
        confirmVariant: options.confirmVariant,
        onCancel: options.onCancel,
        cancelLabel: options.cancelLabel,
      });
    },
    [openModal],
  );

  const value = React.useMemo<ModalContextValue>(
    () => ({ openModal, closeModal, closeAll, confirm }),
    [openModal, closeModal, closeAll, confirm],
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modals.map(({ id, open, options }) => {
        const renderProps: ModalRenderProps = {
          id,
          onClose: () => closeModal(id),
        };
        const content =
          typeof options.content === "function"
            ? options.content(renderProps)
            : options.content;

        return (
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
              title={options.title}
              description={options.description}
              footer={options.footer}
              onConfirm={options.onConfirm}
              confirmLabel={options.confirmLabel}
              confirmVariant={options.confirmVariant}
              onCancel={options.onCancel}
              cancelLabel={options.cancelLabel}
            >
              {content}
            </ModalContent>
          </Modal>
        );
      })}
    </ModalContext.Provider>
  );
};
