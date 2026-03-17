import * as React from "react";

export interface UseCollapseOptions {
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface UseCollapseResult {
  isOpen: boolean;
  disabled: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  setOpen: (value: boolean) => void;
}

export const useCollapse = ({
  open: controlledOpen,
  defaultOpen = false,
  disabled = false,
  onOpenChange,
}: UseCollapseOptions = {}): UseCollapseResult => {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);

  const isOpen = isControlled ? controlledOpen! : internalOpen;

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (disabled) return;
      if (!isControlled) setInternalOpen(value);
      onOpenChange?.(value);
    },
    [disabled, isControlled, onOpenChange],
  );

  const toggle = React.useCallback(() => setOpen(!isOpen), [isOpen, setOpen]);
  const open = React.useCallback(() => setOpen(true), [setOpen]);
  const close = React.useCallback(() => setOpen(false), [setOpen]);

  return { isOpen, disabled, toggle, open, close, setOpen };
};
