import * as DialogPrimitive from "@radix-ui/react-dialog";
import { type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "../cn";
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
          <DialogPrimitive.Close className="absolute right-4 top-4 cursor-pointer rounded-md opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  ),
);
ModalContent.displayName = "ModalContent";
