import { type VariantProps } from "class-variance-authority";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import * as React from "react";

import { cn } from "../cn";
import { Popover,type PopoverContentProps } from "../popover";
import { Calendar, type CalendarProps } from "./Calendar";
import { DatePickerTrigger } from "./DatePickerTrigger";
import { datePickerTriggerVariants } from "./datePickerVariants";

export interface DatePickerProps extends VariantProps<typeof datePickerTriggerVariants> {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Extra className on the trigger button */
  className?: string;
  /** Format string passed to date-fns `format()`. Default: "d MMMM yyyy" */
  dateFormat?: string;
  /** Whether to show a clear button when a date is selected */
  clearable?: boolean;
  /** Props forwarded to PopoverContent */
  contentProps?: Partial<PopoverContentProps>;
  /** Props forwarded to the inner Calendar */
  calendarProps?: Omit<CalendarProps, "selected" | "onSelect">;
}

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = "Выберите дату",
      disabled,
      className,
      dateFormat = "d MMMM yyyy",
      clearable = false,
      size,
      variant,
      contentProps,
      calendarProps,
    },
    ref,
  ) => {
    const handleClear = React.useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.(undefined);
      },
      [onChange],
    );

    return (
      <Popover>
        <div className="relative w-full">
          <Popover.Trigger asChild>
            <DatePickerTrigger
              ref={ref}
              size={size}
              variant={variant}
              disabled={disabled}
              className={cn(
                !value && "text-muted-foreground",
                clearable && value && "pr-7",
                className,
              )}
            >
              <CalendarIcon className="h-4 w-4 shrink-0 opacity-50" />
              <span className="flex-1 truncate text-left">
                {value ? format(value, dateFormat) : placeholder}
              </span>
            </DatePickerTrigger>
          </Popover.Trigger>
          {clearable && value && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
              tabIndex={-1}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <Popover.Content size="auto" align="start" className="p-0" {...contentProps}>
          <Calendar selected={value} onSelect={onChange} {...calendarProps} />
        </Popover.Content>
      </Popover>
    );
  },
);

DatePicker.displayName = "DatePicker";
