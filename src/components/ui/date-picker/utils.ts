export const getDaysInMonth = (month: number, year: number): number =>
  new Date(year, month + 1, 0).getDate();

/** Returns 0-based weekday index where 0=Monday (EU style) */
export const getFirstDayOfMonth = (month: number, year: number): number => {
  const day = new Date(year, month, 1).getDay();

  return day === 0 ? 6 : day - 1;
};
