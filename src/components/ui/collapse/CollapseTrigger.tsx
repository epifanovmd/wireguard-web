import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "../cn";
import { useCollapseContext } from "./CollapseContext";
import { collapseTriggerVariants } from "./collapseVariants";

export interface CollapseTriggerProps {
  children: React.ReactNode;
  className?: string;
  /** Override the default chevron. Pass `false` to hide it entirely. */
  icon?: React.ReactNode | false;
  /** Icon placed before the label */
  leadingIcon?: React.ReactNode;
}

export const CollapseTrigger = React.forwardRef<
  HTMLButtonElement,
  CollapseTriggerProps
>(({ children, className, icon, leadingIcon }, ref) => {
  const { isOpen, disabled, toggle, triggerId, contentId, variant, size } =
    useCollapseContext();

  return (
    <button
      ref={ref}
      id={triggerId}
      type="button"
      aria-expanded={isOpen}
      aria-controls={contentId}
      disabled={disabled}
      onClick={toggle}
      className={cn(collapseTriggerVariants({ variant, size }), className)}
    >
      {leadingIcon && (
        <span className="flex-shrink-0 text-muted-foreground">{leadingIcon}</span>
      )}
      <span className="flex-1 font-medium">{children}</span>
      {icon === false ? null : icon ? (
        <span
          className={cn(
            "flex-shrink-0 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        >
          {icon}
        </span>
      ) : (
        <ChevronDown
          className={cn(
            "flex-shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180",
          )}
          size={size === "sm" ? 14 : size === "lg" ? 18 : 16}
        />
      )}
    </button>
  );
});
CollapseTrigger.displayName = "Collapse.Trigger";
