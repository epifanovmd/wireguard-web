import { ChevronDown, X } from "lucide-react";
import * as React from "react";

import { Spinner } from "../../spinner";

export interface SelectTriggerIconProps {
  loading?: boolean;
  showClear?: boolean;
  onClear?: () => void;
}

export const SelectTriggerIcon = ({
  loading,
  showClear,
  onClear,
}: SelectTriggerIconProps) => {
  if (loading) {
    return <Spinner size="sm" className="h-4 w-4 opacity-50 shrink-0" />;
  }

  if (showClear) {
    return (
      <span
        role="button"
        tabIndex={-1}
        onPointerDown={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={e => {
          e.stopPropagation();
          onClear?.();
        }}
        className="shrink-0 opacity-50 hover:opacity-100 transition-opacity cursor-pointer inline-flex items-center justify-center"
      >
        <X className="h-4 w-4" />
      </span>
    );
  }

  return <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />;
};
