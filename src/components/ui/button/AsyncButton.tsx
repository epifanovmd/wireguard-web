import React, { forwardRef, useCallback, useState } from "react";

import { Button, ButtonProps } from "./Button";

export interface AsyncButtonProps extends Omit<ButtonProps, "onClick"> {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
}

export const AsyncButton = forwardRef<HTMLButtonElement, AsyncButtonProps>(
  ({ onClick, children, ...props }, ref) => {
    const [loading, setLoading] = useState(false);
    const disabled = props.disabled || loading || props.loading;

    const handleClick = useCallback(
      async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick && !disabled) {
          setLoading(true);
          try {
            await onClick?.(e);
          } catch (e) {
            if (e instanceof Error) {
              console.log("AsyncButton onClick ERROR: ", e);
            }
          } finally {
            setLoading(false);
          }
        }
      },
      [disabled, onClick],
    );

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        {...props}
        disabled={disabled}
        loading={loading || props.loading}
      >
        {children}
      </Button>
    );
  },
);
