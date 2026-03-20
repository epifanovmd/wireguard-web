import * as React from "react";

import { cn } from "../cn";
import { MONTHS } from "./constants";

interface CalendarMonthViewProps {
  currentMonth: number;
  onMonthSelect: (month: number) => void;
}

export const CalendarMonthView = React.memo(
  ({ currentMonth, onMonthSelect }: CalendarMonthViewProps) => (
    <div className="p-3">
      <div className="grid grid-cols-3 gap-2">
        {MONTHS.map((month, index) => (
          <button
            key={month}
            type="button"
            onClick={() => onMonthSelect(index)}
            className={cn(
              "py-3 px-4 rounded-md text-sm transition-colors cursor-pointer",
              "hover:bg-accent hover:text-accent-foreground",
              currentMonth === index &&
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            )}
          >
            {month}
          </button>
        ))}
      </div>
    </div>
  ),
);

CalendarMonthView.displayName = "CalendarMonthView";
