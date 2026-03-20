import * as React from "react";

import { type ButtonProps } from "../button";

export interface ModalRenderProps {
  id: string;
  onClose: () => void;
}

export type ModalContent =
  | React.ReactNode
  | ((props: ModalRenderProps) => React.ReactNode);

export interface ModalOptions {
  /** Body content — ReactNode or render prop receiving { id, onClose }. */
  content?: ModalContent;

  // Appearance
  size?: "sm" | "md" | "lg" | "xl" | "full";
  position?: "center" | "top" | "bottom";
  disableInteractOutside?: boolean;
  hideCloseButton?: boolean;

  // Skeleton mode
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Custom footer. Takes precedence over onConfirm/onCancel buttons. */
  footer?: React.ReactNode;
  onConfirm?: () => void | Promise<void>;
  confirmLabel?: string;
  confirmVariant?: ButtonProps["variant"];
  onCancel?: () => void;
  cancelLabel?: string;

  // Lifecycle
  onClose?: () => void;
}

export interface ConfirmOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ButtonProps["variant"];
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
  /** Open a modal. Returns the modal id. */
  openModal: (options: ModalOptions) => string;
  /** Close a modal by id. */
  closeModal: (id: string) => void;
  /** Close all currently open modals. */
  closeAll: () => void;
  /** Open a confirmation dialog. */
  confirm: (options: ConfirmOptions) => void;
}

export const ModalContext = React.createContext<ModalContextValue | null>(null);
