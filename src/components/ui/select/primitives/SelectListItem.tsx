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

export const SelectListItem = React.memo(
  ({
    selected,
    focused,
    disabled,
    onSelect,
    onFocus,
    onBlur,
    children,
  }: SelectListItemProps) => {
    // Store latest callbacks in refs so stable handlers always call the current version.
    // This allows React.memo to skip re-renders when only callbacks change reference.
    const onSelectRef = React.useRef(onSelect);
    const onFocusRef = React.useRef(onFocus);
    const onBlurRef = React.useRef(onBlur);

    onSelectRef.current = onSelect;
    onFocusRef.current = onFocus;
    onBlurRef.current = onBlur;

    const handleSelect = React.useCallback(() => onSelectRef.current?.(), []);
    const handleFocus = React.useCallback(() => onFocusRef.current?.(), []);
    const handleBlur = React.useCallback(() => onBlurRef.current?.(), []);

    return (
      <div
        role="option"
        aria-selected={selected}
        className={cn(
          selectItemClasses,
          "hover:bg-accent hover:text-accent-foreground",
          focused && selectItemHighlightedClasses,
          disabled && "pointer-events-none opacity-50",
        )}
        onMouseEnter={handleFocus}
        onMouseLeave={handleBlur}
        onPointerDown={e => e.preventDefault()}
        onClick={!disabled ? handleSelect : undefined}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          {selected && <Check className="h-4 w-4" />}
        </span>
        {children}
      </div>
    );
  },
  (prev, next) =>
    prev.selected === next.selected &&
    prev.focused === next.focused &&
    prev.disabled === next.disabled &&
    prev.children === next.children,
);

SelectListItem.displayName = "SelectListItem";
