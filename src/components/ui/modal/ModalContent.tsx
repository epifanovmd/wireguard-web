import * as DialogPrimitive from "@radix-ui/react-dialog";
import { type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";

import { Button, type ButtonProps } from "../button";
import { cn } from "../cn";
import { IconButton } from "../icon-button";
import { ModalBody } from "./ModalBody";
import { ModalDescription } from "./ModalDescription";
import { ModalFooter } from "./ModalFooter";
import { ModalHeader } from "./ModalHeader";
import { ModalOverlay } from "./ModalOverlay";
import { ModalTitle } from "./ModalTitle";
import { modalContentVariants } from "./modalVariants";

type ContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
  "title"
>;

type ModalVariantProps = VariantProps<typeof modalContentVariants>;

export interface ModalContentProps extends ContentProps, ModalVariantProps {
  // Layout
  disableInteractOutside?: boolean;
  hideCloseButton?: boolean;

  // Skeleton mode — triggered when any of these are provided
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Custom footer content. Takes precedence over onConfirm/onCancel buttons. */
  footer?: React.ReactNode;

  // Quick action buttons (skeleton footer)
  onConfirm?: () => void | Promise<void>;
  confirmLabel?: string;
  confirmVariant?: ButtonProps["variant"];
  onCancel?: () => void;
  cancelLabel?: string;
  cancelVariant?: ButtonProps["variant"];
}

export const ModalContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(
  (
    {
      className,
      children,
      position,
      size,
      disableInteractOutside,
      hideCloseButton,
      title,
      description,
      footer,
      onConfirm,
      confirmLabel = "Confirm",
      confirmVariant = "primary",
      onCancel,
      cancelLabel = "Cancel",
      cancelVariant = "outline",
      ...props
    },
    ref,
  ) => {
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const closeRef = React.useRef<HTMLButtonElement>(null);

    const isSkeletonMode =
      title !== undefined ||
      footer !== undefined ||
      onConfirm !== undefined ||
      onCancel !== undefined;

    const handleConfirm = async () => {
      setConfirmLoading(true);
      try {
        await onConfirm?.();
        closeRef.current?.click();
      } finally {
        setConfirmLoading(false);
      }
    };

    const handleCancel = () => {
      onCancel?.();
      closeRef.current?.click();
    };

    const resolvedFooter =
      footer ??
      (onConfirm !== undefined || onCancel !== undefined ? (
        <>
          {onCancel !== undefined && (
            <Button
              variant={cancelVariant}
              onClick={handleCancel}
              disabled={confirmLoading}
            >
              {cancelLabel}
            </Button>
          )}
          {onConfirm !== undefined && (
            <Button
              variant={confirmVariant}
              onClick={handleConfirm}
              loading={confirmLoading}
            >
              {confirmLabel}
            </Button>
          )}
        </>
      ) : null);

    return (
      <DialogPrimitive.Portal>
        <ModalOverlay />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            modalContentVariants({ position, size }),
            "flex max-h-[85vh] flex-col",
            className,
          )}
          onPointerDownOutside={e => {
            if (disableInteractOutside) e.preventDefault();
          }}
          onEscapeKeyDown={e => {
            if (disableInteractOutside) e.preventDefault();
          }}
          {...props}
        >
          {isSkeletonMode ? (
            <>
              {title !== undefined && (
                <ModalHeader>
                  <ModalTitle>{title}</ModalTitle>
                  {description && (
                    <ModalDescription>{description}</ModalDescription>
                  )}
                </ModalHeader>
              )}
              {children && <ModalBody>{children}</ModalBody>}
              {resolvedFooter && <ModalFooter>{resolvedFooter}</ModalFooter>}
            </>
          ) : (
            children
          )}

          {!hideCloseButton && (
            <DialogPrimitive.Close asChild>
              <IconButton
                size="sm"
                aria-label="Close"
                className="absolute right-3 top-3"
              >
                <X size={14} />
              </IconButton>
            </DialogPrimitive.Close>
          )}

          {/* Hidden trigger for programmatic close after async confirm/cancel */}
          <DialogPrimitive.Close
            ref={closeRef}
            className="sr-only"
            tabIndex={-1}
          />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  },
);
ModalContent.displayName = "ModalContent";
