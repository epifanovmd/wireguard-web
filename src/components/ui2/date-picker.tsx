import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import * as React from "react";

import { Button } from "./button";
import { cn } from "./cn";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
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

interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selected, onSelect }) => {
  const [viewMode, setViewMode] = React.useState<ViewMode>("day");
  const [currentMonth, setCurrentMonth] = React.useState(
    selected?.getMonth() ?? new Date().getMonth(),
  );
  const [currentYear, setCurrentYear] = React.useState(
    selected?.getFullYear() ?? new Date().getFullYear(),
  );

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert Sunday (0) to 6, and shift Mon-Sat
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
    const newDate = new Date(currentYear, currentMonth, day);
    onSelect?.(newDate);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    return (
      day === selected.getDate() &&
      currentMonth === selected.getMonth() &&
      currentYear === selected.getFullYear()
    );
  };

  const renderDayView = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days: (number | null)[] = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
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
                    isSelected(day) &&
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

const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = "Pick a date",
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
            {value ? format(value, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar selected={value} onSelect={onChange} />
        </PopoverContent>
      </Popover>
    );
  },
);
DatePicker.displayName = "DatePicker";

export { DatePicker };
