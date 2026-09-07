import { t } from '@/i18n';

const MONTH_KEYS = [
  'months.january',
  'months.february',
  'months.march',
  'months.april',
  'months.may',
  'months.june',
  'months.july',
  'months.august',
  'months.september',
  'months.october',
  'months.november',
  'months.december',
];

export function isInSeason(seasonWindow: [number, number], date: Date): boolean {
  const month = date.getMonth();
  const [start, end] = seasonWindow;
  if (start <= end) return month >= start && month <= end;
  return month >= start || month <= end;
}

/** The month name a species next comes into season, for "Out of season · opens in {Month}" copy. */
export function nextSeasonMonthName(seasonWindow: [number, number], date: Date): string {
  const [start] = seasonWindow;
  if (isInSeason(seasonWindow, date)) return t(MONTH_KEYS[date.getMonth()]);
  return t(MONTH_KEYS[start]);
}
