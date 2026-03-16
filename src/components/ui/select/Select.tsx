import {
  ElementProps,
  Select as MantineSelect,
  SelectProps,
} from "@mantine/core";
import React, { forwardRef } from "react";

export interface ISelectProps
  extends SelectProps,
    ElementProps<"input", keyof SelectProps> {}

export const Select = forwardRef<HTMLInputElement, ISelectProps>(
  ({ size = "sm", allowDeselect = false, ...props }, ref) => {
    return (
      <MantineSelect
        ref={ref}
        size={size}
        allowDeselect={allowDeselect}
        {...props}
      />
    );
  },
);
