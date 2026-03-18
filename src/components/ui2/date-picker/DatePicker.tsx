import { type VariantProps } from "class-variance-authority";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import * as React from "react";

import { cn } from "../cn";
import { Popover, type PopoverContentProps } from "../popover";
import { Calendar, type CalendarProps } from "./Calendar";
import { DatePickerTrigger } from "./DatePickerTrigger";
import { datePickerTriggerVariants } from "./datePickerVariants";

export interface DatePickerProps
  extends VariantProps<typeof datePickerTriggerVariants> {
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
    const showClear = clearable && !!value && !disabled;

    return (
      <Popover>
        <Popover.Trigger asChild>
          <DatePickerTrigger
            ref={ref}
            size={size}
            variant={variant}
            disabled={disabled}
            className={cn(!value && "text-muted-foreground", className)}
          >
            <CalendarIcon className="h-4 w-4 shrink-0 opacity-50" />
            <span className="flex-1 truncate text-left">
              {value ? format(value, dateFormat) : placeholder}
            </span>
            {showClear && (
              <span
                role="button"
                tabIndex={-1}
                onPointerDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={e => {
                  e.stopPropagation();
                  onChange?.(undefined);
                }}
                className="shrink-0 opacity-50 hover:opacity-100 transition-opacity cursor-pointer inline-flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </span>
            )}
          </DatePickerTrigger>
        </Popover.Trigger>

        <Popover.Content
          size="auto"
          align="start"
          className="p-0"
          {...contentProps}
        >
          <Calendar selected={value} onSelect={onChange} {...calendarProps} />
        </Popover.Content>
      </Popover>
    );
  },
);

DatePicker.displayName = "DatePicker";
