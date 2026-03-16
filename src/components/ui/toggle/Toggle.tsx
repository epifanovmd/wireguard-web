import { Switch, SwitchProps } from "@mantine/core";
import React, { forwardRef } from "react";

export interface IToggleProps extends Omit<SwitchProps, "onChange"> {
  onChange?: (
    checked: boolean,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}

export const Toggle = forwardRef<HTMLInputElement, IToggleProps>(
  ({ onChange, size = "sm", ...props }, ref) => {
    return (
      <Switch
        ref={ref}
        size={size}
        onChange={e => onChange?.(e.currentTarget.checked, e)}
        {...props}
      />
    );
  },
);
