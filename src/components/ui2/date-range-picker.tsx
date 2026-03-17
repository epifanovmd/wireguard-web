import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";

import { Button } from "./button";
import { cn } from "./cn";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

type ViewMode = "day" | "month" | "year";

const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const DAYS_OF_WEEK = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

interface RangeCalendarProps {
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
}

const RangeCalendar: React.FC<RangeCalendarProps> = ({
  selected,
  onSelect,
}) => {
  const [viewMode, setViewMode] = React.useState<ViewMode>("day");
  const [currentMonth, setCurrentMonth] = React.useState(
    selected?.from?.getMonth() ?? new Date().getMonth(),
  );
  const [currentYear, setCurrentYear] = React.useState(
    selected?.from?.getFullYear() ?? new Date().getFullYear(),
  );
  const [rangeStart, setRangeStart] = React.useState<Date | null>(
    selected?.from ?? null,
  );

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handlePrevious = () => {
    if (viewMode === "day") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else if (viewMode === "month") {
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentYear(currentYear - 12);
    }
  };

  const handleNext = () => {
    if (viewMode === "day") {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    } else if (viewMode === "month") {
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentYear(currentYear + 12);
    }
  };

  const handleHeaderClick = () => {
    if (viewMode === "day") {
      setViewMode("month");
    } else if (viewMode === "month") {
      setViewMode("year");
    }
  };

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth(monthIndex);
    setViewMode("day");
  };

  const handleYearSelect = (year: number) => {
    setCurrentYear(year);
    setViewMode("month");
  };

  const handleDaySelect = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);

    if (!rangeStart || (rangeStart && selected?.to)) {
      // Start new range
      setRangeStart(clickedDate);
      onSelect?.({ from: clickedDate, to: undefined });
    } else {
      // Complete range
      if (clickedDate < rangeStart) {
        onSelect?.({ from: clickedDate, to: rangeStart });
      } else {
        onSelect?.({ from: rangeStart, to: clickedDate });
      }
      setRangeStart(null);
    }
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isInRange = (day: number) => {
    if (!selected?.from) return false;
    const date = new Date(currentYear, currentMonth, day);

    if (selected.to) {
      return date >= selected.from && date <= selected.to;
    }

    return date.getTime() === selected.from.getTime();
  };

  const isRangeStart = (day: number) => {
    if (!selected?.from) return false;
    const date = new Date(currentYear, currentMonth, day);
    return date.getTime() === selected.from.getTime();
  };

  const isRangeEnd = (day: number) => {
    if (!selected?.to) return false;
    const date = new Date(currentYear, currentMonth, day);
    return date.getTime() === selected.to.getTime();
  };

  const renderDayView = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return (
      <div className="p-3">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS_OF_WEEK.map(day => (
            <div
              key={day}
              className="h-9 w-9 text-center text-sm font-medium text-muted-foreground flex items-center justify-center"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div key={index} className="h-9 w-9">
              {day !== null && (
                <button
                  onClick={() => handleDaySelect(day)}
                  className={cn(
                    "h-9 w-9 rounded-md text-sm transition-colors inline-flex items-center justify-center hover:bg-accent hover:text-accent-foreground cursor-pointer",
                    isToday(day) && "bg-accent text-accent-foreground",
                    isInRange(day) &&
                      !isRangeStart(day) &&
                      !isRangeEnd(day) &&
                      "bg-accent text-accent-foreground",
                    (isRangeStart(day) || isRangeEnd(day)) &&
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  )}
                >
                  {day}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    return (
      <div className="p-3">
        <div className="grid grid-cols-3 gap-2">
          {MONTHS.map((month, index) => (
            <button
              key={month}
              onClick={() => handleMonthSelect(index)}
              className={cn(
                "py-3 px-4 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer",
                currentMonth === index &&
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              )}
            >
              {month}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderYearView = () => {
    const startYear = Math.floor(currentYear / 12) * 12;
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);

    return (
      <div className="p-3">
        <div className="grid grid-cols-3 gap-2">
          {years.map(year => (
            <button
              key={year}
              onClick={() => handleYearSelect(year)}
              className={cn(
                "py-3 px-4 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer",
                currentYear === year &&
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              )}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const getHeaderText = () => {
    if (viewMode === "day") {
      return `${MONTHS[currentMonth]} ${currentYear}`;
    } else if (viewMode === "month") {
      return currentYear.toString();
    } else {
      const startYear = Math.floor(currentYear / 12) * 12;
      return `${startYear} - ${startYear + 11}`;
    }
  };

  return (
    <div className="w-[280px]">
      <div className="flex items-center justify-between p-3 border-b">
        <button
          onClick={handlePrevious}
          className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md transition-opacity cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={handleHeaderClick}
          className={cn(
            "text-sm font-medium hover:bg-accent px-3 py-1 rounded-md transition-colors cursor-pointer",
            viewMode === "year" && "cursor-default hover:bg-transparent",
          )}
          disabled={viewMode === "year"}
        >
          {getHeaderText()}
        </button>
        <button
          onClick={handleNext}
          className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md transition-opacity cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      {viewMode === "day" && renderDayView()}
      {viewMode === "month" && renderMonthView()}
      {viewMode === "year" && renderYearView()}
    </div>
  );
};

const DateRangePicker = React.forwardRef<
  HTMLButtonElement,
  DateRangePickerProps
>(
  (
    {
      value,
      onChange,
      placeholder = "Pick a date range",
      disabled,
      className,
      size = "md",
    },
    ref,
  ) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            size={size}
            className={cn(
              "justify-start text-left font-normal",
              !value && "text-muted-foreground",
              className,
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <RangeCalendar selected={value} onSelect={onChange} />
        </PopoverContent>
      </Popover>
    );
  },
);
DateRangePicker.displayName = "DateRangePicker";

export { DateRangePicker };
