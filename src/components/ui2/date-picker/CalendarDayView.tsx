import * as React from "react";

import { cn } from "../cn";
import { DAYS_OF_WEEK } from "./constants";
import { getDaysInMonth, getFirstDayOfMonth } from "./utils";

interface CalendarDayViewProps {
  currentMonth: number;
  currentYear: number;
  onDaySelect: (day: number) => void;
  /** Return extra className(s) for a given day number */
  getDayClassName: (day: number) => string | undefined;
}

export const CalendarDayView = React.memo(
  ({ currentMonth, currentYear, onDaySelect, getDayClassName }: CalendarDayViewProps) => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const cells: (number | null)[] = Array.from({ length: firstDay }, () => null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return (
      <div className="p-3">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS_OF_WEEK.map(day => (
            <div
              key={day}
              className="h-9 w-9 text-center text-xs font-medium text-muted-foreground flex items-center justify-center"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => (
            <div key={i} className="h-9 w-9">
              {day !== null && (
                <button
                  type="button"
                  onClick={() => onDaySelect(day)}
                  className={cn(
                    "h-9 w-9 rounded-md text-sm transition-colors inline-flex items-center justify-center",
                    "hover:bg-accent hover:text-accent-foreground cursor-pointer",
                    getDayClassName(day),
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
  },
);

CalendarDayView.displayName = "CalendarDayView";
