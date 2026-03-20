import { useCallback, useState } from "react";

import type { DateRange } from "../types";

export interface UseDateRangeResult {
  rangeStart: Date | null;
  handleDaySelect: (date: Date, onSelect?: (range: DateRange | undefined) => void) => void;
}

export const useDateRange = (selected: DateRange | undefined): UseDateRangeResult => {
  const [rangeStart, setRangeStart] = useState<Date | null>(selected?.from ?? null);

  const handleDaySelect = useCallback(
    (date: Date, onSelect?: (range: DateRange | undefined) => void) => {
      if (!rangeStart || selected?.to) {
        setRangeStart(date);
        onSelect?.({ from: date, to: undefined });
      } else {
        if (date < rangeStart) {
          onSelect?.({ from: date, to: rangeStart });
        } else {
          onSelect?.({ from: rangeStart, to: date });
        }
        setRangeStart(null);
      }
    },
    [rangeStart, selected?.to],
  );

  return { rangeStart, handleDaySelect };
};
