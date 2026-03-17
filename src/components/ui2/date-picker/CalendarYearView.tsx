import * as React from "react";

import { cn } from "../cn";

interface CalendarYearViewProps {
  currentYear: number;
  onYearSelect: (year: number) => void;
}

export const CalendarYearView = React.memo(
  ({ currentYear, onYearSelect }: CalendarYearViewProps) => {
    const startYear = Math.floor(currentYear / 12) * 12;
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);

    return (
      <div className="p-3">
        <div className="grid grid-cols-3 gap-2">
          {years.map(year => (
            <button
              key={year}
              type="button"
              onClick={() => onYearSelect(year)}
              className={cn(
                "py-3 px-4 rounded-md text-sm transition-colors cursor-pointer",
                "hover:bg-accent hover:text-accent-foreground",
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
  },
);

CalendarYearView.displayName = "CalendarYearView";
