import * as React from "react";

import { cn } from "../cn";
import { CalendarDayView } from "./CalendarDayView";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarMonthView } from "./CalendarMonthView";
import { CalendarYearView } from "./CalendarYearView";
import { useCalendar } from "./hooks";

export interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
}

export const Calendar = React.memo(({ selected, onSelect, className }: CalendarProps) => {
  const {
    viewMode,
    currentMonth,
    currentYear,
    headerText,
    handlePrevious,
    handleNext,
    handleHeaderClick,
    handleMonthSelect,
    handleYearSelect,
  } = useCalendar({
    initialMonth: selected?.getMonth(),
    initialYear: selected?.getFullYear(),
  });

  const handleDaySelect = React.useCallback(
    (day: number) => {
      onSelect?.(new Date(currentYear, currentMonth, day));
    },
    [currentYear, currentMonth, onSelect],
  );

  const today = new Date();

  const getDayClassName = React.useCallback(
    (day: number) => {
      const isToday =
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();
      const isSelected =
        !!selected &&
        day === selected.getDate() &&
        currentMonth === selected.getMonth() &&
        currentYear === selected.getFullYear();

      return {
        button: cn(
          isToday && !isSelected && "bg-accent text-accent-foreground",
          isSelected &&
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        ),
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentMonth, currentYear, selected],
  );

  return (
    <div className={cn("w-[280px]", className)}>
      <CalendarHeader
        headerText={headerText}
        viewMode={viewMode}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onHeaderClick={handleHeaderClick}
      />
      {viewMode === "day" && (
        <CalendarDayView
          currentMonth={currentMonth}
          currentYear={currentYear}
          onDaySelect={handleDaySelect}
          getDayClassName={getDayClassName}
        />
      )}
      {viewMode === "month" && (
        <CalendarMonthView currentMonth={currentMonth} onMonthSelect={handleMonthSelect} />
      )}
      {viewMode === "year" && (
        <CalendarYearView currentYear={currentYear} onYearSelect={handleYearSelect} />
      )}
    </div>
  );
});

Calendar.displayName = "Calendar";
