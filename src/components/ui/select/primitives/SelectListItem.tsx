import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "../../cn";
import {
  selectItemClasses,
  selectItemHighlightedClasses,
} from "../selectVariants";

export interface SelectListItemProps {
  selected?: boolean;
  focused?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  children?: React.ReactNode;
}

export const SelectListItem = ({
  selected,
  focused,
  disabled,
  onSelect,
  onFocus,
  onBlur,
  children,
}: SelectListItemProps) => (
  <div
    role="option"
    aria-selected={selected}
    className={cn(
      selectItemClasses,
      "hover:bg-accent hover:text-accent-foreground",
      focused && selectItemHighlightedClasses,
      disabled && "pointer-events-none opacity-50",
    )}
    onMouseEnter={onFocus}
    onMouseLeave={onBlur}
    onPointerDown={e => e.preventDefault()}
    onClick={!disabled ? onSelect : undefined}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      {selected && <Check className="h-4 w-4" />}
    </span>
    {children}
  </div>
);

SelectListItem.displayName = "SelectListItem";
