import { type VariantProps } from "class-variance-authority";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import * as React from "react";

import { cn } from "../cn";
import { Popover, type PopoverContentProps } from "../popover";
import { DatePickerTrigger } from "./DatePickerTrigger";
import { datePickerTriggerVariants } from "./datePickerVariants";
import { RangeCalendar, type RangeCalendarProps } from "./RangeCalendar";
import type { DateRange } from "./types";

export interface DateRangePickerProps
  extends VariantProps<typeof datePickerTriggerVariants> {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Extra className on the trigger button */
  className?: string;
  /** Format string passed to date-fns `format()`. Default: "d MMM yyyy" */
  dateFormat?: string;
  /** Whether to show a clear button when a range is selected */
  clearable?: boolean;
  /** Props forwarded to PopoverContent */
  contentProps?: Partial<PopoverContentProps>;
  /** Props forwarded to the inner RangeCalendar */
  calendarProps?: Omit<RangeCalendarProps, "selected" | "onSelect">;
}

export const DateRangePicker = React.forwardRef<
  HTMLButtonElement,
  DateRangePickerProps
>(
  (
    {
      value,
      onChange,
      placeholder = "Выберите период",
      disabled,
      className,
      dateFormat = "d MMM yyyy",
      clearable = false,
      size,
      variant,
      contentProps,
      calendarProps,
    },
    ref,
  ) => {
    const hasValue = !!value?.from;
    const showClear = clearable && hasValue && !disabled;

    const label = React.useMemo(() => {
      if (!value?.from) return null;
      if (value.to)
        return `${format(value.from, dateFormat)} — ${format(value.to, dateFormat)}`;

      return format(value.from, dateFormat);
    }, [value, dateFormat]);

    return (
      <Popover>
        <Popover.Trigger asChild>
          <DatePickerTrigger
            ref={ref}
            size={size}
            variant={variant}
            disabled={disabled}
            className={cn(!hasValue && "text-muted-foreground", className)}
          >
            <CalendarIcon className="h-4 w-4 shrink-0 opacity-50" />
            <span className="flex-1 truncate text-left">
              {label ?? placeholder}
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
          <RangeCalendar
            selected={value}
            onSelect={onChange}
            {...calendarProps}
          />
        </Popover.Content>
      </Popover>
    );
  },
);

DateRangePicker.displayName = "DateRangePicker";
