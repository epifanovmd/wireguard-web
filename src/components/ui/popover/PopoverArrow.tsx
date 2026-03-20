import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";

import { cn } from "../cn";

export type PopoverArrowProps = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Arrow
>;

export const PopoverArrow = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Arrow>,
  PopoverArrowProps
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Arrow
    ref={ref}
    className={cn("fill-popover stroke-border", className)}
    {...props}
  />
));

PopoverArrow.displayName = "PopoverArrow";
