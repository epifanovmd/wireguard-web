import "@mantine/dates/styles.css";

import { DatePickerInput, DatePickerInputProps } from "@mantine/dates";
import React, { forwardRef } from "react";

export const DateRangePicker = forwardRef<
  HTMLButtonElement,
  DatePickerInputProps<"range">
>(({ placeholder = "Pick date range", size = "sm" }, ref) => {
  return (
    <DatePickerInput
      ref={ref}
      type="range"
      placeholder={placeholder}
      size={size}
      valueFormat="DD MMM YYYY"
      clearable
    />
  );
});
