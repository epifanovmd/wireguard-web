import { Loader2 } from "lucide-react";
import React, { forwardRef, useCallback, useState } from "react";

import { IconButton, IconButtonProps } from "./IconButton";

export interface AsyncIconButtonProps extends Omit<IconButtonProps, "onClick"> {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
}

export const AsyncIconButton = forwardRef<
  HTMLButtonElement,
  AsyncIconButtonProps
>(({ onClick, children, disabled, ...props }, ref) => {
  const [loading, setLoading] = useState(false);
  const isDisabled = disabled || loading;

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick && !isDisabled) {
        setLoading(true);
        try {
          await onClick(e);
        } finally {
          setLoading(false);
        }
      }
    },
    [isDisabled, onClick],
  );

  return (
    <IconButton ref={ref} disabled={isDisabled} onClick={handleClick} {...props}>
      {loading ? <Loader2 className="animate-spin" size={15} /> : children}
    </IconButton>
  );
});

AsyncIconButton.displayName = "AsyncIconButton";
