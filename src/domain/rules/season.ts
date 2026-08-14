const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Season windows are inclusive month-index ranges [start, end], 0 = January, and wrap when
 * end < start (e.g. Orange 10-2 spans Nov -> Mar). */
export function isInSeason(seasonWindow: [number, number], date: Date): boolean {
  const month = date.getMonth();
  const [start, end] = seasonWindow;
  if (start <= end) return month >= start && month <= end;
  return month >= start || month <= end;
}

/** The month name a species next comes into season, for "Out of season · opens in {Month}" copy. */
export function nextSeasonMonthName(seasonWindow: [number, number], date: Date): string {
  const [start] = seasonWindow;
  if (isInSeason(seasonWindow, date)) return MONTH_NAMES[date.getMonth()];
  return MONTH_NAMES[start];
}
