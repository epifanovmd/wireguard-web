import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../cn";
import {
  CollapseContext,
  type CollapseSize,
  type CollapseVariant,
} from "./CollapseContext";
import { collapseTriggerVariants } from "./collapseVariants";
import { useCollapse, type UseCollapseOptions } from "./useCollapse";

export interface CollapseProps
  extends UseCollapseOptions,
    VariantProps<typeof collapseTriggerVariants> {
  children: React.ReactNode;
  className?: string;
}

export const CollapseRoot = React.forwardRef<HTMLDivElement, CollapseProps>(
  (
    {
      open,
      defaultOpen,
      disabled,
      onOpenChange,
      variant = "ghost",
      size = "md",
      children,
      className,
    },
    ref,
  ) => {
    const collapse = useCollapse({ open, defaultOpen, disabled, onOpenChange });
    const id = React.useId();

    const ctx = React.useMemo(
      () => ({
        ...collapse,
        triggerId: `collapse-trigger-${id}`,
        contentId: `collapse-content-${id}`,
        variant: (variant ?? "ghost") as CollapseVariant,
        size: (size ?? "md") as CollapseSize,
      }),
      [collapse, id, variant, size],
    );

    return (
      <CollapseContext.Provider value={ctx}>
        <div ref={ref} className={cn("w-full", className)}>
          {children}
        </div>
      </CollapseContext.Provider>
    );
  },
);
CollapseRoot.displayName = "Collapse";
