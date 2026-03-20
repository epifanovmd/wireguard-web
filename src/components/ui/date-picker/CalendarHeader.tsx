import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import { cn } from "../cn";
import type { ViewMode } from "./types";

interface CalendarHeaderProps {
  headerText: string;
  viewMode: ViewMode;
  onPrevious: () => void;
  onNext: () => void;
  onHeaderClick: () => void;
}

export const CalendarHeader = React.memo(
  ({ headerText, viewMode, onPrevious, onNext, onHeaderClick }: CalendarHeaderProps) => (
    <div className="flex items-center justify-between p-3 border-b">
      <button
        type="button"
        onClick={onPrevious}
        className="h-7 w-7 p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md transition-opacity cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onHeaderClick}
        disabled={viewMode === "year"}
        className={cn(
          "text-sm font-medium hover:bg-accent px-3 py-1 rounded-md transition-colors cursor-pointer",
          viewMode === "year" && "cursor-default pointer-events-none",
        )}
      >
        {headerText}
      </button>
      <button
        type="button"
        onClick={onNext}
        className="h-7 w-7 p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md transition-opacity cursor-pointer"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  ),
);

CalendarHeader.displayName = "CalendarHeader";
