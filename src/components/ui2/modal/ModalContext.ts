import * as React from "react";

export interface ModalRenderProps {
  id: string;
  onClose: () => void;
}

export type ModalContent = React.ReactNode | ((props: ModalRenderProps) => React.ReactNode);

export interface ModalOptions {
  content: ModalContent;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  position?: "center" | "top" | "bottom";
  disableInteractOutside?: boolean;
  hideCloseButton?: boolean;
  scrollable?: boolean;
  onClose?: () => void;
}

export interface ConfirmOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "default" | "destructive" | "primary" | "warning";
  size?: "sm" | "md";
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface ModalEntry {
  id: string;
  open: boolean;
  options: ModalOptions;
}

export interface ModalContextValue {
  /** Open a modal with arbitrary content. Returns the modal id. */
  openModal: (options: ModalOptions) => string;
  /** Close a modal by id. */
  closeModal: (id: string) => void;
  /** Close all currently open modals. */
  closeAll: () => void;
  /** Open a confirmation dialog. */
  confirm: (options: ConfirmOptions) => void;
}

export const ModalContext = React.createContext<ModalContextValue | null>(null);
