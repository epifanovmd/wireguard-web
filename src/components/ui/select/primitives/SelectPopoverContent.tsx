import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";

import { cn } from "../../cn";
import { selectContentClasses } from "../selectVariants";

export interface SelectPopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  children?: React.ReactNode;
}

export const SelectPopoverContent = ({
  className,
  children,
  sideOffset = 4,
  align = "start",
  onOpenAutoFocus,
  ...props
}: SelectPopoverContentProps) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      sideOffset={sideOffset}
      align={align}
      onOpenAutoFocus={e => {
        e.preventDefault();
        onOpenAutoFocus?.(e);
      }}
      className={cn(
        selectContentClasses,
        "w-[var(--radix-popover-trigger-width)] max-h-60",
        className,
      )}
      {...props}
    >
      {children}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
);

SelectPopoverContent.displayName = "SelectPopoverContent";
