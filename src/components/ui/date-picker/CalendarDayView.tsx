import * as React from "react";

import { cn } from "../cn";
import { DAYS_OF_WEEK } from "./constants";
import { getDaysInMonth, getFirstDayOfMonth } from "./utils";

export interface DayState {
  /** Classes applied to the background strip div (for range fills). */
  wrapper?: string;
  /** Classes applied to the day button itself. */
  button?: string;
}

interface CalendarDayViewProps {
  currentMonth: number;
  currentYear: number;
  onDaySelect: (day: number) => void;
  getDayClassName: (day: number) => DayState | undefined;
}

export const CalendarDayView = React.memo(
  ({ currentMonth, currentYear, onDaySelect, getDayClassName }: CalendarDayViewProps) => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const cells: (number | null)[] = Array.from({ length: firstDay }, () => null);

    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return (
      <div className="p-3">
        <div className="grid grid-cols-7 mb-2">
          {DAYS_OF_WEEK.map(day => (
            <div
              key={day}
              className="h-9 text-center text-xs font-medium text-muted-foreground flex items-center justify-center"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            const state = day !== null ? getDayClassName(day) : undefined;

            return (
              <div key={i} className="relative h-9 flex items-center justify-center">
                {state?.wrapper && <div className={state.wrapper} />}
                {day !== null && (
                  <button
                    type="button"
                    onClick={() => onDaySelect(day)}
                    className={cn(
                      "relative z-10 h-8 w-8 rounded-md text-sm transition-colors",
                      "inline-flex items-center justify-center cursor-pointer",
                      "hover:bg-accent hover:text-accent-foreground",
                      state?.button,
                    )}
                  >
                    {day}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

CalendarDayView.displayName = "CalendarDayView";
