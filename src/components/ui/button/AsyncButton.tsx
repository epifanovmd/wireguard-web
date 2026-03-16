import React, { forwardRef, useCallback, useState } from "react";

import { Button, IButtonProps } from "./Button";

export interface IAsyncButtonProps extends Omit<IButtonProps, "onClick"> {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
}

export const AsyncButton = forwardRef<HTMLButtonElement, IAsyncButtonProps>(
  ({ onClick, children, disabled, loading, ...props }, ref) => {
    const [pending, setPending] = useState(false);
    const isLoading = loading || pending;
    const isDisabled = disabled || isLoading;

    const handleClick = useCallback(
      async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!onClick || isDisabled) return;
        setPending(true);
        try {
          await onClick(e);
        } catch (err) {
          if (err instanceof Error) {
            console.error("AsyncButton error:", err.message);
          }
        } finally {
          setPending(false);
        }
      },
      [onClick, isDisabled],
    );

    return (
      <Button
        ref={ref}
        {...props}
        disabled={isDisabled}
        loading={isLoading}
        onClick={handleClick}
      >
        {children}
      </Button>
    );
  },
);
