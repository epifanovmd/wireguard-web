import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { TooltipContent, type TooltipContentProps } from "./TooltipContent";
import { TooltipTrigger } from "./TooltipTrigger";

export interface TooltipProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> {
  content?: React.ReactNode;
  contentProps?: TooltipContentProps;
}

const _Tooltip = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Root>,
  TooltipProps
>(({ content, contentProps, children, ...props }, _ref) => {
  if (content !== undefined) {
    return (
      <TooltipPrimitive.Root {...props}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent {...contentProps}>{content}</TooltipContent>
      </TooltipPrimitive.Root>
    );
  }

  return (
    <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>
  );
});

_Tooltip.displayName = "Tooltip";

export const Tooltip = Object.assign(_Tooltip, {
  Trigger: TooltipTrigger,
  Content: TooltipContent,
});
