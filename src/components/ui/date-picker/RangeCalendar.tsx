import * as React from "react";

import { cn } from "../cn";
import { CalendarDayView } from "./CalendarDayView";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarMonthView } from "./CalendarMonthView";
import { CalendarYearView } from "./CalendarYearView";
import { useCalendar, useDateRange } from "./hooks";
import type { DateRange } from "./types";

export interface RangeCalendarProps {
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
  className?: string;
}

export const RangeCalendar = React.memo(
  ({ selected, onSelect, className }: RangeCalendarProps) => {
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
      initialMonth: selected?.from?.getMonth(),
      initialYear: selected?.from?.getFullYear(),
    });

    const { handleDaySelect } = useDateRange(selected);

    const handleDayClick = React.useCallback(
      (day: number) => {
        handleDaySelect(new Date(currentYear, currentMonth, day), onSelect);
      },
      [currentYear, currentMonth, handleDaySelect, onSelect],
    );

    const today = new Date();

    const getDayClassName = React.useCallback(
      (day: number) => {
        const date = new Date(currentYear, currentMonth, day);
        const isToday =
          day === today.getDate() &&
          currentMonth === today.getMonth() &&
          currentYear === today.getFullYear();
        const isStart = !!selected?.from && date.getTime() === selected.from.getTime();
        const isEnd = !!selected?.to && date.getTime() === selected.to.getTime();
        const isInRange =
          !!selected?.from &&
          !!selected?.to &&
          date >= selected.from &&
          date <= selected.to;

        return cn(
          isToday && !isStart && !isEnd && "bg-accent text-accent-foreground",
          isInRange &&
            !isStart &&
            !isEnd &&
            "bg-accent/60 text-accent-foreground rounded-none",
          (isStart || isEnd) &&
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        );
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
            onDaySelect={handleDayClick}
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
  },
);

RangeCalendar.displayName = "RangeCalendar";
