import { Modal as MantineModal } from "@mantine/core";
import React, { FC, ReactNode } from "react";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

const SIZE_MAP: Record<ModalSize, string> = {
  sm: "sm",
  md: "lg",
  lg: "xl",
  xl: "90vw",
  full: "100vw",
};

export interface ModalProps {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  /** @deprecated use `size` instead */
  width?: string;
  closable?: boolean;
  maskClosable?: boolean;
  className?: string;
  bodyClassName?: string;
}

export const Modal: FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = "sm",
  width,
  closable = true,
  maskClosable = true,
  className,
  bodyClassName,
}) => {
  return (
    <MantineModal
      opened={open}
      onClose={onClose ?? (() => {})}
      title={title}
      size={width ?? SIZE_MAP[size]}
      withCloseButton={closable}
      closeOnClickOutside={maskClosable}
      className={className}
      classNames={{ body: bodyClassName }}
    >
      {children}
      {footer && (
        <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-[var(--border)]">
          {footer}
        </div>
      )}
    </MantineModal>
  );
};
