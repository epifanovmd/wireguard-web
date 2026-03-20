import { X } from "lucide-react";
import * as React from "react";

import { cn } from "../../cn";

export interface SelectTagProps {
  label: React.ReactNode;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
}

export const SelectTag = ({
  label,
  onRemove,
  disabled,
  className,
}: SelectTagProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-0.5 rounded bg-accent text-accent-foreground",
      "px-1.5 py-0.5 text-xs font-medium max-w-[150px]",
      disabled && "opacity-50",
      className,
    )}
  >
    <span className="truncate">{label}</span>
    {onRemove && !disabled && (
      <button
        type="button"
        tabIndex={-1}
        onPointerDown={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={e => {
          e.stopPropagation();
          onRemove();
        }}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity ml-0.5"
      >
        <X className="h-3 w-3" />
      </button>
    )}
  </span>
);

SelectTag.displayName = "SelectTag";
