import { useLoading } from "@force-dev/react";
import React, {
  ComponentProps,
  FC,
  memo,
  PropsWithChildren,
  useCallback,
} from "react";

import { Button } from "./Button";

export interface IAsyncButtonProps
  extends Omit<ComponentProps<typeof Button>, "onClick"> {
  onClick?: () => void | Promise<void>;
}

export const AsyncButton: FC<PropsWithChildren<IAsyncButtonProps>> = memo(
  ({ onClick, children, ...props }) => {
    const [loading, startLoading, stopLoading] = useLoading();

    const handleClick = useCallback(async () => {
      if (onClick) {
        startLoading();
        try {
          await onClick?.();
        } catch (e) {
          if (e instanceof Error) {
            console.log("AsyncButton onClick ERROR: ", e.message);
          }
        } finally {
          stopLoading();
        }
      }
    }, [onClick, startLoading, stopLoading]);

    return (
      <Button
        {...props}
        onClick={handleClick}
        loading={loading || props.loading}
      >
        {children}
      </Button>
    );
  },
);
