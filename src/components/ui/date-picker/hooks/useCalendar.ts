import { useCallback, useMemo, useState } from "react";

import { MONTHS } from "../constants";
import type { ViewMode } from "../types";

export interface UseCalendarOptions {
  initialMonth?: number;
  initialYear?: number;
}

export interface UseCalendarResult {
  viewMode: ViewMode;
  currentMonth: number;
  currentYear: number;
  headerText: string;
  handlePrevious: () => void;
  handleNext: () => void;
  handleHeaderClick: () => void;
  handleMonthSelect: (month: number) => void;
  handleYearSelect: (year: number) => void;
}

export const useCalendar = ({
  initialMonth,
  initialYear,
}: UseCalendarOptions = {}): UseCalendarResult => {
  const now = new Date();
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [currentMonth, setCurrentMonth] = useState(initialMonth ?? now.getMonth());
  const [currentYear, setCurrentYear] = useState(initialYear ?? now.getFullYear());

  const handlePrevious = useCallback(() => {
    if (viewMode === "day") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(y => y - 1);
      } else {
        setCurrentMonth(m => m - 1);
      }
    } else if (viewMode === "month") {
      setCurrentYear(y => y - 1);
    } else {
      setCurrentYear(y => y - 12);
    }
  }, [viewMode, currentMonth]);

  const handleNext = useCallback(() => {
    if (viewMode === "day") {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(y => y + 1);
      } else {
        setCurrentMonth(m => m + 1);
      }
    } else if (viewMode === "month") {
      setCurrentYear(y => y + 1);
    } else {
      setCurrentYear(y => y + 12);
    }
  }, [viewMode, currentMonth]);

  const handleHeaderClick = useCallback(() => {
    if (viewMode === "day") setViewMode("month");
    else if (viewMode === "month") setViewMode("year");
  }, [viewMode]);

  const handleMonthSelect = useCallback((month: number) => {
    setCurrentMonth(month);
    setViewMode("day");
  }, []);

  const handleYearSelect = useCallback((year: number) => {
    setCurrentYear(year);
    setViewMode("month");
  }, []);

  const headerText = useMemo(() => {
    if (viewMode === "day") return `${MONTHS[currentMonth]} ${currentYear}`;
    if (viewMode === "month") return String(currentYear);
    const startYear = Math.floor(currentYear / 12) * 12;
    return `${startYear} — ${startYear + 11}`;
  }, [viewMode, currentMonth, currentYear]);

  return {
    viewMode,
    currentMonth,
    currentYear,
    headerText,
    handlePrevious,
    handleNext,
    handleHeaderClick,
    handleMonthSelect,
    handleYearSelect,
  };
};
