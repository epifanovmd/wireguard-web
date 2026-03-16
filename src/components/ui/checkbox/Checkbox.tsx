import {
  Checkbox as MantineCheckbox,
  CheckboxProps,
  ElementProps,
} from "@mantine/core";
import React, { forwardRef } from "react";

export interface ICheckboxProps
  extends CheckboxProps,
    ElementProps<"input", keyof CheckboxProps> {}

export const Checkbox = forwardRef<HTMLInputElement, ICheckboxProps>(
  ({ size = "sm", ...props }, ref) => {
    return (
      <MantineCheckbox
        classNames={{ root: "cursor-pointer" }}
        ref={ref}
        size={size}
        {...props}
      />
    );
  },
);
