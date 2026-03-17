import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "./cn";

const Modal = DialogPrimitive.Root;

const ModalTrigger = DialogPrimitive.Trigger;

const ModalPortal = DialogPrimitive.Portal;

const ModalClose = DialogPrimitive.Close;

interface ModalOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {
  disableInteractOutside?: boolean;
}

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  ModalOverlayProps
>(({ className, disableInteractOutside, ...props }, ref) => {
  const [isPulsing, setIsPulsing] = React.useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (disableInteractOutside) {
      e.preventDefault();
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 600);
    }
  };

  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 transition-all duration-200",
        className,
      )}
      style={{ backgroundColor: "var(--overlay)" }}
      onClick={handleClick}
      {...props}
    />
  );
});
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

const modalContentVariants = cva(
  "fixed z-50 border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 rounded-xl",
  {
    variants: {
      position: {
        center:
          "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        top: "left-1/2 top-[10%] -translate-x-1/2 data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "left-1/2 bottom-[10%] -translate-x-1/2 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
      },
      size: {
        sm: "w-full max-w-sm",
        md: "w-full max-w-lg",
        lg: "w-full max-w-2xl",
        xl: "w-full max-w-4xl",
        full: "w-[calc(100vw-2rem)] max-w-none mx-4",
      },
    },
    defaultVariants: {
      position: "center",
      size: "md",
    },
  },
);

interface ModalContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof modalContentVariants> {
  disableInteractOutside?: boolean;
  hideCloseButton?: boolean;
  scrollable?: boolean;
}

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
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
  ) => {
    return (
      <ModalPortal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 transition-all duration-200",
          )}
          style={{ backgroundColor: "var(--overlay)" }}
        />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            modalContentVariants({ position, size }),
            scrollable && "max-h-[85vh] flex flex-col",
            className,
          )}
          onPointerDownOutside={e => {
            if (disableInteractOutside) {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={e => {
            if (disableInteractOutside) {
              e.preventDefault();
            }
          }}
          {...props}
        >
          {children}
          {!hideCloseButton && (
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-md opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none cursor-pointer">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </ModalPortal>
    );
  },
);
ModalContent.displayName = DialogPrimitive.Content.displayName;

const ModalHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left p-6 pb-4",
      className,
    )}
    {...props}
  />
);
ModalHeader.displayName = "ModalHeader";

const ModalBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-6 overflow-y-auto flex-1", className)} {...props} />
);
ModalBody.displayName = "ModalBody";

const ModalFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-4",
      className,
    )}
    {...props}
  />
);
ModalFooter.displayName = "ModalFooter";

const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
ModalTitle.displayName = DialogPrimitive.Title.displayName;

const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
ModalDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalPortal,
  ModalTitle,
  ModalTrigger,
};
