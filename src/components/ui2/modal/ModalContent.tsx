import * as DialogPrimitive from "@radix-ui/react-dialog";
import { type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "../cn";
import { IconButton } from "../icon-button";
import { ModalOverlay } from "./ModalOverlay";
import { modalContentVariants } from "./modalVariants";

export interface ModalContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof modalContentVariants> {
  disableInteractOutside?: boolean;
  hideCloseButton?: boolean;
  scrollable?: boolean;
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
      scrollable,
      ...props
    },
    ref,
  ) => (
    <DialogPrimitive.Portal>
      <ModalOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          modalContentVariants({ position, size }),
          scrollable && "flex max-h-[85vh] flex-col",
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
        {children}
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
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  ),
);
ModalContent.displayName = "ModalContent";
